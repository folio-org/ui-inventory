import {
  get,
  orderBy,
  isEmpty,
  values,
} from 'lodash';
import React, {
  Fragment,
  createRef,
} from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import queryString from 'query-string';

import {
  AppIcon,
  TitleManager,
  IntlConsumer,
  IfPermission,
} from '@folio/stripes/core';
import {
  Pane,
  Row,
  Col,
  Button,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  KeyValue,
  Layer,
  Layout,
  Icon,
  Headline,
  MultiColumnList,
  Callout,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  areAllFieldsEmpty,
  craftLayerUrl,
  checkIfElementIsEmpty,
  convertArrayToBlocks,
  checkIfArrayIsEmpty,
  getDateWithTime,
  getSortedNotes,
  marshalInstance,
  staffOnlyFormatter,
  unmarshalInstance,
} from './utils';
import formatters from './referenceFormatters';
import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewMarc from './ViewMarc';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';

import { TitlesView } from './components';
import {
  wrappingCell,
  noValue,
  emptyList,
} from './constants';

class ViewInstance extends React.Component {
  static manifest = Object.freeze({
    query: {},
    selectedInstance: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      clear: false,
      throwErrors: false,
    },
    holdings: {
      type: 'okapi',
      records: 'holdingsRecords',
      path: 'holdings-storage/holdings',
      fetch: false,
      throwErrors: false,
    },
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{id}/formatted?idType=INSTANCE',
      accumulate: true,
      throwErrors: false,
    },
    blockedFields: {
      type: 'okapi',
      path: 'inventory/config/instances/blocked-fields',
      clear: false,
      throwErrors: false,
    },
    instanceRelationshipTypes: {
      type: 'okapi',
      records: 'instanceRelationshipTypes',
      path: 'instance-relationship-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
  });

  constructor(props) {
    super(props);

    const logger = props.stripes.logger;
    this.log = logger.log.bind(logger);

    this.state = {
      marcRecord: null,
    };
    this.instanceId = null;
    this.cHoldings = this.props.stripes.connect(Holdings);
    this.cViewHoldingsRecord = this.props.stripes.connect(ViewHoldingsRecord);
    this.cViewMetaData = this.props.stripes.connect(ViewMetaData);
    this.cViewMarc = this.props.stripes.connect(ViewMarc);

    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.calloutRef = createRef();
  }

  /**
   * Load the MARC record if the selectedInstance has changed and has source === MARC
   */

  componentDidMount() {
    const isMARCSource = this.isMARCSource();

    if (isMARCSource) {
      this.getMARCRecord();
    }
  }

  componentDidUpdate(prevProps) {
    const { resources: prevResources } = prevProps;
    const { resources } = this.props;
    const instanceRecords = get(resources, 'selectedInstance.records', []);
    const instanceRecordsId = instanceRecords?.[0]?.id;
    const isMARCSource = this.isMARCSource();

    const previousRecords = get(prevResources, 'selectedInstance.records', []);
    const prevInstanceRecordsId = previousRecords?.[0]?.id;

    if (isMARCSource && instanceRecordsId !== prevInstanceRecordsId) {
      this.getMARCRecord();
    }
  }

  isMARCSource = () => {
    const { resources } = this.props;
    const instanceRecords = get(resources, 'selectedInstance.records', []);
    const instanceRecordsSource = instanceRecords?.[0]?.source;

    return instanceRecordsSource === 'MARC';
  };

  getMARCRecord = () => {
    const { mutator } = this.props;
    mutator.marcRecord.GET()
      .then(data => this.setState({ marcRecord: data }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('MARC record getting ERROR: ', error);
      });
  };

  getPublisherAndDate = instance => {
    const publisher = get(instance, 'publication[0].publisher', '');
    const dateOfPublication = get(instance, 'publication[0].dateOfPublication', '');
    let publisherAndDate = publisher;

    publisherAndDate += (publisher) ? `, ${dateOfPublication}` : publisherAndDate;

    return publisherAndDate;
  };

  // Edit Instance Handlers
  onClickEditInstance = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'edit' });
  };

  editInstanceMarc = () => {
    const { history, location, match } = this.props;
    const instanceId = match.params.id;

    history.push({
      pathname: `/inventory/quick-marc/edit/${instanceId}`,
      search: location.search,
    });
  };

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.props.updateLocation({ layer: 'createHoldingsRecord' });
  };

  update = (instance) => {
    const { referenceTables: { identifierTypesByName } } = this.props;

    // Massage record to add preceeding and succeeding title fields
    marshalInstance(instance, identifierTypesByName);

    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.resetLayerQueryParam();
    });
  };

  resetLayerQueryParam = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  };

  goBack = (e) => {
    if (e) e.preventDefault();

    const {
      goTo,
      match: {
        params: { id },
      },
      location: { pathname, search }
    } = this.props;

    // extract instance url
    const [path] = pathname.match(new RegExp(`(.*)${id}`));

    goTo(`${path}${search}`);
  };

  closeViewMarc = (e) => {
    if (e) e.preventDefault();
    const { location: { search } } = this.props;
    this.resetLayerQueryParam();
    this.props.goTo(`/inventory/view/${this.props.match.params.id}${search}`);
  };

  createHoldingsRecord = (holdingsRecord) => {
    // POST holdings record
    this.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord).then(() => {
      this.resetLayerQueryParam();
    });
  };

  handleViewSource = (e, instance) => {
    if (e) e.preventDefault();
    const {
      location,
      goTo,
    } = this.props;
    const { marcRecord } = this.state;

    if (!marcRecord) {
      const message = (
        <FormattedMessage
          id="ui-inventory.marcSourceRecord.notFoundError"
          values={{ name: instance.title }}
        />
      );
      this.calloutRef.current.sendCallout({
        type: 'error',
        message,
      });
      return;
    }
    goTo(`${location.pathname.replace('/view/', '/viewsource/')}${location.search}`);
  };

  refLookup = (referenceTable, id) => {
    const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
    return ref || {};
  };

  createActionMenuGetter = instance => ({ onToggle }) => {
    const {
      onCopy,
      stripes
    } = this.props;
    const { marcRecord } = this.state;
    const isSourceMARC = get(instance, ['source'], '') === 'MARC';
    const canEditInstance = stripes.hasPerm('ui-inventory.instance.edit');
    const canCreateInstance = stripes.hasPerm('ui-inventory.instance.create');

    if (!isSourceMARC && !canEditInstance && !canCreateInstance) {
      return null;
    }

    return (
      <Fragment>
        <IfPermission perm="ui-inventory.instance.edit">
          <Button
            id="edit-instance"
            href={this.craftLayerUrl('edit')}
            onClick={() => {
              onToggle();
              this.onClickEditInstance();
            }}
            buttonStyle="dropdownItem"
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-inventory.editInstance" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="ui-inventory.instance.create">
          <Button
            id="copy-instance"
            onClick={() => {
              onToggle();
              onCopy(instance);
            }}
            buttonStyle="dropdownItem"
          >
            <Icon icon="duplicate">
              <FormattedMessage id="ui-inventory.duplicateInstance" />
            </Icon>
          </Button>
        </IfPermission>

        {
          isSourceMARC && (
            <>
              <IfPermission perm="ui-inventory.instance.view">
                <Button
                  id="clickable-view-source"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={(e) => {
                    onToggle();
                    this.handleViewSource(e, instance);
                  }}
                >
                  <Icon icon="document">
                    <FormattedMessage id="ui-inventory.viewSource" />
                  </Icon>
                </Button>
              </IfPermission>

              <IfPermission perm="records-editor.records.item.put">
                <Button
                  id="edit-instance-marc"
                  buttonStyle="dropdownItem"
                  disabled={!marcRecord}
                  onClick={() => {
                    onToggle();
                    this.editInstanceMarc();
                  }}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-inventory.editInstanceMarc" />
                  </Icon>
                </Button>
              </IfPermission>
            </>
          )
        }
      </Fragment>
    );
  };

  render() {
    const {
      okapi,
      match: { params: { id, holdingsrecordid, itemid } },
      location,
      referenceTables,
      stripes,
      onClose,
      paneWidth,
    } = this.props;

    const { marcRecord } = this.state;

    const { identifierTypesById } = referenceTables;

    const query = location.search ? queryString.parse(location.search) : {};
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();
    const identifiersRowFormatter = {
      'Resource identifier type': x => get(x, ['identifierType']) || noValue,
      'Resource identifier': x => get(x, ['value']) || noValue,
    };

    const classificationsRowFormatter = {
      'Classification identifier type': x => get(x, ['classificationType']) || noValue,
      'Classification': x => get(x, ['classificationNumber']) || noValue,
    };

    const alternativeTitlesRowFormatter = {
      'Alternative title type': x => this.refLookup(referenceTables.alternativeTitleTypes, get(x, ['alternativeTitleTypeId'])).name || noValue,
      'Alternative title': x => get(x, ['alternativeTitle']) || noValue,
    };

    const publicationRowFormatter = {
      'Publisher': x => get(x, ['publisher']) || noValue,
      'Publisher role': x => get(x, ['role']) || noValue,
      'Place of publication': x => get(x, ['place']) || noValue,
      'Publication date': x => get(x, ['dateOfPublication']) || noValue,
    };

    const contributorsRowFormatter = {
      'Name type': x => this.refLookup(referenceTables.contributorNameTypes, get(x, ['contributorNameTypeId'])).name || noValue,
      'Name': x => get(x, ['name']) || noValue,
      'Type': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).name || noValue,
      'Code': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).code || noValue,
      'Source': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).source || noValue,
      'Free text': x => get(x, ['contributorTypeText']) || noValue,
      'Primary': ({ primary }) => (primary ? <FormattedMessage id="ui-inventory.primary" /> : noValue)
    };

    const electronicAccessRowFormatter = {
      'URL relationship': x => this.refLookup(referenceTables.electronicAccessRelationships, get(x, ['relationshipId'])).name || noValue,
      'URI': x => (get(x, ['uri'])
        ? (
          <a
            href={get(x, ['uri'])}
            style={wrappingCell}
          >
            {get(x, ['uri'])}
          </a>)
        : noValue),
      'Link text': x => get(x, ['linkText']) || noValue,
      'Materials specified': x => get(x, ['materialsSpecification']) || noValue,
      'URL public note': x => get(x, ['publicNote']) || noValue,
    };

    const formatsRowFormatter = {
      'Category': x => {
        const term = this.refLookup(referenceTables.instanceFormats, x.id).name;
        if (term && term.split('--').length === 2) {
          return term.split('--')[0];
        } else {
          return noValue;
        }
      },
      'Term': x => {
        const term = this.refLookup(referenceTables.instanceFormats, x.id).name;
        if (term && term.split('--').length === 2) {
          return term.split('--')[1];
        } else {
          return term || noValue;
        }
      },
      'Code': x => this.refLookup(referenceTables.instanceFormats, x.id).code || noValue,
      'Source': x => this.refLookup(referenceTables.instanceFormats, x.id).source || noValue,
    };

    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={<FormattedMessage id="ui-inventory.editInstance" />}
          appIcon={<AppIcon app="inventory" iconKey="instance" />}
          dismissible
          onClose={onClose}
        >
          <div style={{ paddingTop: '1rem' }}>
            <Icon
              icon="spinner-ellipsis"
              width="100px"
            />
          </div>
        </Pane>
      );
    }

    const instanceSub = () => {
      const { publication } = instance;
      if (publication && publication.length > 0 && publication[0]) {
        return `${publication[0].publisher}${publication[0].dateOfPublication ? `, ${publication[0].dateOfPublication}` : ''}`;
      }
      return null;
    };

    const newHoldingsRecordButton = stripes.hasPerm('ui-inventory.holdings.create') && (
      <FormattedMessage id="ui-inventory.addHoldings">
        {ariaLabel => (
          <Button
            id="clickable-new-holdings-record"
            href={this.craftLayerUrl('createHoldingsRecord', location)}
            onClick={this.onClickAddNewHoldingsRecord}
            aria-label={ariaLabel}
            buttonStyle="primary"
            fullWidth
          >
            <FormattedMessage id="ui-inventory.addHoldings" />
          </Button>
        )}
      </FormattedMessage>
    );

    if (query.layer === 'edit') {
      return (
        <IntlConsumer>
          {(intl) => (
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editInstanceDialog' })}
            >
              <InstanceForm
                onSubmit={this.update}
                initialValues={unmarshalInstance(instance, identifierTypesById)}
                instanceSource={get(instance, ['source'])}
                referenceTables={referenceTables}
                stripes={stripes}
                match={this.props.match}
                onCancel={this.resetLayerQueryParam}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    if (query.layer === 'createHoldingsRecord') {
      return (
        <IntlConsumer>
          {intl => (
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.addNewHoldingsDialog' })}
            >
              <HoldingsForm
                form={instance.id}
                id={instance.id}
                key={instance.id}
                initialValues={{ instanceId: instance.id }}
                onSubmit={this.createHoldingsRecord}
                onCancel={this.resetLayerQueryParam}
                okapi={okapi}
                instance={instance}
                referenceTables={referenceTables}
                stripes={stripes}
              />
            </Layer>
          )}
        </IntlConsumer>
      );
    }

    const layoutNotes = content => {
      const notesList = isEmpty(content) ? emptyList : content;
      const orderedNotes = orderBy(notesList, ['noteType.name'], ['asc']);

      return orderedNotes.map(({ noteType, notes }, i) => {
        const noteName = noteType ? noteType.name : <FormattedMessage id="ui-inventory.unknownNoteType" />;

        return (
          <Row key={i}>
            <MultiColumnList
              key={i}
              id={`list-instance-notes-${i}`}
              contentData={notesList === emptyList ? emptyList : notes}
              visibleColumns={['Staff only', 'Note']}
              columnMapping={{
                'Staff only': <FormattedMessage id="ui-inventory.staffOnly" />,
                'Note': notesList === emptyList ? <FormattedMessage id="ui-inventory.note" /> : noteName,
              }}
              columnWidths={{
                'Staff only': '25%',
                'Note': '75%',
              }}
              formatter={{
                'Staff only': x => (notesList === emptyList ? noValue : staffOnlyFormatter(x)),
                'Note': x => get(x, ['note']) || noValue,
              }}
              containerRef={ref => { this.resultsList = ref; }}
              interactive={false}
            />
          </Row>
        );
      });
    };

    const instanceData = {
      instanceHrid: get(instance, ['hrid'], '-'),
      metadataSource: get(instance, ['source'], '-'),
      catalogedDate: get(instance, ['catalogedDate'], '-'),
      instanceStatusTerm: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).name || '-',
      instanceStatusCode: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).code || '-',
      instanceStatusSource: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).source || '-',
      instanceStatusUpdatedDate: instance?.statusUpdatedDate,
      modeOfIssuance: formatters.modesOfIssuanceFormatter(instance, referenceTables.modesOfIssuance) || '-',
      statisticalCodeIds: get(instance, ['statisticalCodeIds'], []),
    };

    const statisticalCodeIdsContent = !isEmpty(instanceData.statisticalCodeIds)
      ? instanceData.statisticalCodeIds.map(codeId => ({ 'codeId': codeId }))
      : emptyList;

    const titleData = {
      resourceTitle: get(instance, ['title'], '-'),
      alternativeTitles: get(instance, ['alternativeTitles'], []),
      indexTitle: get(instance, ['indexTitle'], '-'),
      series: get(instance, ['series'], []),
    };
    const {
      precedingTitles,
      succeedingTitles,
    } = instance;

    const seriesContent = !isEmpty(titleData.series) ? titleData.series.map(x => ({ value: x })) : emptyList;
    const identifiers = get(instance, 'identifiers', []).map(x => ({
      identifierType: this.refLookup(referenceTables.identifierTypes, get(x, 'identifierTypeId')).name,
      value: x.value,
    }));

    const orderedIdentifiers = orderBy(
      identifiers,
      [
        ({ identifierType }) => identifierType.toLowerCase(),
        ({ value }) => value.toLowerCase(),
      ],
      ['asc'],
    );

    const contributors = get(instance, ['contributors'], []);

    const natureOfContentTerms = get(instance, 'natureOfContentTermIds', [])
      .map(termId => this.refLookup(referenceTables.natureOfContentTerms, termId).name);

    const descriptiveData = {
      publication: get(instance, ['publication'], []),
      editions: get(instance, ['editions'], []),
      physicalDescriptions: get(instance, ['physicalDescriptions'], []),
      resourceTypeTerm: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).name || '-',
      resourceTypeCode: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).code || '-',
      resourceTypeSource: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).source || '-',
      natureOfContentTerms: natureOfContentTerms || [],
      instanceFormatIds: get(instance, ['instanceFormatIds'], []),
      languages: get(instance, ['languages'], []),
      publicationFrequency: get(instance, ['publicationFrequency'], []),
      publicationRange: get(instance, ['publicationRange'], []),
    };

    const instanceFormatIdsContent = !isEmpty(descriptiveData.instanceFormatIds)
      ? descriptiveData.instanceFormatIds.map(formatId => ({ 'id': formatId }))
      : emptyList;

    const languagesContent = !isEmpty(descriptiveData.languages) ? formatters.languagesFormatter(instance) : noValue;

    const instanceNotes = getSortedNotes(instance, 'instanceNoteTypeId', referenceTables.instanceNoteTypes);

    const electronicAccess = get(instance, ['electronicAccess'], []);

    const subjects = get(instance, ['subjects'], []);

    const subjectsContent = !isEmpty(subjects) ? subjects.map(item => ({ value: item })) : emptyList;

    const classifications = get(instance, 'classifications', []).map(x => ({
      classificationType: this.refLookup(referenceTables.classificationTypes, get(x, 'classificationTypeId')).name,
      classificationNumber: x.classificationNumber,
    }));

    const orderedClassifications = orderBy(
      classifications,
      [
        ({ classificationType }) => classificationType.toLowerCase(),
        ({ classificationNumber }) => classificationNumber.toLowerCase(),
      ],
      ['asc'],
    );

    const instanceRelationship = {
      childInstances: get(instance, ['childInstances'], []),
      parentInstances: get(instance, ['parentInstances'], []),
    };

    const childInstancesContentLabel = !isEmpty(instanceRelationship.childInstances)
      ? referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.childInstances[0].instanceRelationshipTypeId).name + ' (M)'
      : <FormattedMessage id="ui-inventory.childInstances" />;

    const childInstancesContentValue = !isEmpty(instanceRelationship.childInstances)
      ? formatters.childInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)
      : noValue;

    const parentInstancesContentLabel = !isEmpty(instanceRelationship.parentInstances)
      ? referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.parentInstances[0].instanceRelationshipTypeId).name
      : <FormattedMessage id="ui-inventory.parentInstances" />;

    const parentInstancesContentValue = !isEmpty(instanceRelationship.parentInstances)
      ? formatters.parentInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)
      : noValue;

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(values(instanceData)),
      acc02: !areAllFieldsEmpty(values(titleData)),
      acc03: !areAllFieldsEmpty([identifiers]),
      acc04: !areAllFieldsEmpty([contributors]),
      acc05: !areAllFieldsEmpty(values(descriptiveData)),
      acc06: !areAllFieldsEmpty([instanceNotes]),
      acc07: !areAllFieldsEmpty([electronicAccess]),
      acc08: !areAllFieldsEmpty([subjects]),
      acc09: !areAllFieldsEmpty([classifications]),
      acc10: !areAllFieldsEmpty(values(instanceRelationship)),
    };

    const formattedStatusUpdatedDate = getDateWithTime(instanceData.instanceStatusUpdatedDate);

    return (
      <Pane
        data-test-instance-details
        defaultWidth={paneWidth}
        appIcon={<AppIcon app="inventory" iconKey="instance" />}
        paneTitle={
          <span data-test-header-title>
            <FormattedMessage
              id="ui-inventory.instanceRecordTitle"
              values={{
                title: instance.title,
                publisherAndDate: this.getPublisherAndDate(instance),
              }}
            />
          </span>
        }
        paneSub={instanceSub()}
        dismissible
        onClose={onClose}
        actionMenu={this.createActionMenuGetter(instance)}
      >
        <TitleManager record={instance.title} />
        <AccordionStatus>
          <Row end="xs">
            <Col
              data-test-expand-all
              xs
            >
              <ExpandAllButton />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={12}>
              <Layout className="display-flex flex-align-items-center padding-bottom-gutter flex-wrap--wrap">
                <Layout className="margin-end-gutter display-flex flex-align-items-center">
                  <AppIcon
                    app="inventory"
                    iconKey="instance"
                    size="small"
                  >
                    <FormattedMessage id="ui-inventory.instanceRecord" />
                  </AppIcon>
                </Layout>
                <Layout className="margin-end-gutter display-flex flex-align-items-center">
                  <AppIcon
                    app="inventory"
                    iconKey="resource-type"
                    size="small"
                  >
                    {formatters.instanceTypesFormatter(instance, referenceTables.instanceTypes)}
                  </AppIcon>
                </Layout>
              </Layout>
            </Col>
          </Row>
          <Headline
            data-test-headline-medium
            size="medium"
            margin="medium"
          >
            {instance.title}
          </Headline>
          <AccordionSet initialStatus={initialAccordionsState}>
            {
              (!holdingsrecordid && !itemid) ?
                (
                  <Switch>
                    <Route
                      path="/inventory/viewsource/"
                      render={() => (
                        <this.cViewMarc
                          instance={instance}
                          marcRecord={marcRecord}
                          stripes={stripes}
                          match={this.props.match}
                          onClose={this.closeViewMarc}
                          paneWidth={this.props.paneWidth}
                        />
                      )}
                    />
                    <Route
                      path="/inventory/view/"
                      render={() => (
                        <this.cHoldings
                          dataKey={id}
                          id={id}
                          instance={instance}
                          referenceTables={referenceTables}
                          match={this.props.match}
                          stripes={stripes}
                          location={location}
                        />
                      )}
                    />
                  </Switch>
                )
                :
                null
            }

            <Row>
              <Col sm={12}>{newHoldingsRecordButton}</Col>
            </Row>
            <Accordion
              id="acc01"
              label={<FormattedMessage id="ui-inventory.instanceData" />}
            >
              <this.cViewMetaData metadata={instance.metadata} />
              <Row>
                <Col xs={12}>
                  {instance.discoverySuppress && <FormattedMessage id="ui-inventory.discoverySuppress" />}
                  {instance.discoverySuppress && instance.staffSuppress && '|'}
                  {instance.staffSuppress && <FormattedMessage id="ui-inventory.staffSuppress" />}
                  {(instance.discoverySuppress || instance.staffSuppress) && instance.previouslyHeld && '|'}
                  {instance.previouslyHeld && <FormattedMessage id="ui-inventory.previouslyHeld" />}
                </Col>
              </Row>
              {(instance.discoverySuppress || instance.staffSuppress || instance.previouslyHeld) && <br />}
              <Row>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.instanceHrid" />}
                    value={checkIfElementIsEmpty(instanceData.instanceHrid)}
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.metadataSource" />}
                    value={checkIfElementIsEmpty(instanceData.metadataSource)}
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.catalogedDate" />}
                    value={checkIfElementIsEmpty(instanceData.catalogedDate)}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.instanceStatusTerm" />}
                    value={checkIfElementIsEmpty(instanceData.instanceStatusTerm)}
                    subValue={
                      <FormattedMessage
                        id="ui-inventory.item.status.statusUpdatedLabel"
                        values={{ statusDate: formattedStatusUpdatedDate }}
                      />
                    }
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.instanceStatusCode" />}
                    value={checkIfElementIsEmpty(instanceData.instanceStatusCode)}
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.instanceStatusSource" />}
                    value={checkIfElementIsEmpty(instanceData.instanceStatusSource)}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
                    value={checkIfElementIsEmpty(instanceData.modeOfIssuance)}
                  />
                </Col>
              </Row>
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.statisticalCodes">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-statistical-codes"
                          contentData={statisticalCodeIdsContent}
                          visibleColumns={['Statistical code type', 'Statistical code', 'Statistical code name']}
                          columnMapping={{
                            'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                            'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                            'Statistical code name': intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
                          }}
                          columnWidths={{
                            'Statistical code type': '25%',
                            'Statistical code': '25%',
                            'Statistical code name': '25%',
                          }}
                          formatter={{
                            'Statistical code type':
                              x => this.refLookup(referenceTables.statisticalCodeTypes,
                                this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name || noValue,
                            'Statistical code':
                              x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).code || noValue,
                            'Statistical code name':
                              x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name || noValue,
                          }}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc02"
              label={<FormattedMessage id="ui-inventory.titleData" />}
            >
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.resourceTitle" />}
                    value={checkIfElementIsEmpty(titleData.resourceTitle)}
                  />
                </Col>
              </Row>
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.alternativeTitles">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-alternative-titles"
                          contentData={checkIfArrayIsEmpty(titleData.alternativeTitles)}
                          rowMetadata={['alternativeTitleTypeId']}
                          visibleColumns={['Alternative title type', 'Alternative title']}
                          columnMapping={{
                            'Alternative title type': intl.formatMessage({ id: 'ui-inventory.alternativeTitleType' }),
                            'Alternative title': intl.formatMessage({ id: 'ui-inventory.alternativeTitle' }),
                          }}
                          columnWidths={{
                            'Alternative title type': '25%',
                            'Alternative title': '75%',
                          }}
                          formatter={alternativeTitlesRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.indexTitle" />}
                    value={checkIfElementIsEmpty(titleData.indexTitle)}
                  />
                </Col>
              </Row>
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.seriesStatement">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-series-statement"
                          contentData={seriesContent}
                          visibleColumns={['Series statement']}
                          columnMapping={{ 'Series statement': intl.formatMessage({ id: 'ui-inventory.seriesStatement' }) }}
                          columnWidths={{ 'Series statement': '99%' }}
                          formatter={{ 'Series statement': x => get(x, ['value']) || noValue }}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
              <Row>
                <Col
                  data-test-preceding-titles
                  xs={12}
                >
                  <TitlesView
                    id="precedingTitles"
                    titleKey="precedingInstanceId"
                    label={<FormattedMessage id="ui-inventory.precedingTitles" />}
                    titles={isEmpty(precedingTitles) ? emptyList : precedingTitles}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  data-test-succeeding-titles
                  xs={12}
                >
                  <TitlesView
                    id="succeedingTitles"
                    titleKey="succeedingInstanceId"
                    label={<FormattedMessage id="ui-inventory.succeedingTitles" />}
                    titles={isEmpty(succeedingTitles) ? emptyList : succeedingTitles}
                  />
                </Col>
              </Row>
            </Accordion>

            <Accordion
              id="acc03"
              label={<FormattedMessage id="ui-inventory.identifier" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.identifiers">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-identifiers"
                          contentData={checkIfArrayIsEmpty(orderedIdentifiers)}
                          rowMetadata={['identifierTypeId']}
                          visibleColumns={['Resource identifier type', 'Resource identifier']}
                          columnMapping={{
                            'Resource identifier type': intl.formatMessage({ id: 'ui-inventory.resourceIdentifierType' }),
                            'Resource identifier': intl.formatMessage({ id: 'ui-inventory.resourceIdentifier' }),
                          }}
                          columnWidths={{
                            'Resource identifier type': '25%',
                            'Resource identifier': '75%',
                          }}
                          formatter={identifiersRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc04"
              label={<FormattedMessage id="ui-inventory.contributor" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.contributors">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-contributors"
                          contentData={checkIfArrayIsEmpty(contributors)}
                          visibleColumns={['Name type', 'Name', 'Type', 'Free text', 'Primary']}
                          columnMapping={{
                            'Name type': intl.formatMessage({ id: 'ui-inventory.nameType' }),
                            'Name': intl.formatMessage({ id: 'ui-inventory.name' }),
                            'Type': intl.formatMessage({ id: 'ui-inventory.type' }),
                            'Free text': intl.formatMessage({ id: 'ui-inventory.freeText' }),
                            'Primary': intl.formatMessage({ id: 'ui-inventory.primary' }),
                          }}
                          columnWidths={{
                            'Name type': '25%',
                            'Name': '25%',
                            'Type': '12%',
                            'Free text': '13%',
                          }}
                          formatter={contributorsRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc05"
              label={<FormattedMessage id="ui-inventory.descriptiveData" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.publication">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-publication"
                          contentData={checkIfArrayIsEmpty(descriptiveData.publication)}
                          visibleColumns={['Publisher', 'Publisher role', 'Place of publication', 'Publication date']}
                          columnMapping={{
                            'Publisher': intl.formatMessage({ id: 'ui-inventory.publisher' }),
                            'Publisher role': intl.formatMessage({ id: 'ui-inventory.publisherRole' }),
                            'Place of publication': intl.formatMessage({ id: 'ui-inventory.placeOfPublication' }),
                            'Publication date': intl.formatMessage({ id: 'ui-inventory.dateOfPublication' }),
                          }}
                          columnWidths={{
                            'Publisher': '25%',
                            'Publisher role': '25%',
                            'Place of publication': '25%',
                          }}
                          formatter={publicationRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
              <br />
              <Row>
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.edition" />}
                    value={convertArrayToBlocks(descriptiveData.editions)}
                  />
                </Col>
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.physicalDescription" />}
                    value={convertArrayToBlocks(descriptiveData.physicalDescriptions)}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.resourceTypeTerm" />}
                    value={checkIfElementIsEmpty(descriptiveData.resourceTypeTerm)}
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.resourceTypeCode" />}
                    value={checkIfElementIsEmpty(descriptiveData.resourceTypeCode)}
                  />
                </Col>
                <Col xs={3}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.resourceTypeSource" />}
                    value={checkIfElementIsEmpty(descriptiveData.resourceTypeSource)}
                  />
                </Col>
              </Row>

              <Row>
                <Col
                  data-test-nature-of-content-terms
                  xs={3}
                >
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
                    value={convertArrayToBlocks(descriptiveData.natureOfContentTerms)}
                  />
                </Col>
              </Row>

              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.formats">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-formats"
                          contentData={instanceFormatIdsContent}
                          visibleColumns={['Category', 'Term', 'Code', 'Source']}
                          columnMapping={{
                            'Category': intl.formatMessage({ id: 'ui-inventory.formatCategory' }),
                            'Term': intl.formatMessage({ id: 'ui-inventory.formatTerm' }),
                            'Code': intl.formatMessage({ id: 'ui-inventory.formatCode' }),
                            'Source': intl.formatMessage({ id: 'ui-inventory.formatSource' }),
                          }}
                          columnWidths={{
                            'Category': '25%',
                            'Term': '25%',
                            'Code': '25%',
                          }}
                          formatter={formatsRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.language" />}
                    value={languagesContent}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
                    value={convertArrayToBlocks(descriptiveData.publicationFrequency)}
                  />
                </Col>
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.publicationRange" />}
                    value={convertArrayToBlocks(descriptiveData.publicationRange)}
                  />
                </Col>
              </Row>
            </Accordion>

            <Accordion
              id="acc06"
              label={<FormattedMessage id="ui-inventory.instanceNotes" />}
            >
              {layoutNotes(instanceNotes)}
            </Accordion>

            <Accordion
              id="acc07"
              label={<FormattedMessage id="ui-inventory.electronicAccess" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.electronicAccess">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-electronic-access"
                          contentData={checkIfArrayIsEmpty(electronicAccess)}
                          visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                          columnMapping={{
                            'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
                            'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
                            'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
                            'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
                            'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
                          }}
                          columnWidths={{
                            'URL relationship': '25%',
                            'URI': '25%',
                            'Link text': '25%',
                            'Materials specified': '25%',
                            'URL public note': '25%',
                          }}
                          formatter={electronicAccessRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc08"
              label={<FormattedMessage id="ui-inventory.subject" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.subject">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-subject"
                          contentData={subjectsContent}
                          visibleColumns={['Subject headings']}
                          columnMapping={{ 'Subject headings': intl.formatMessage({ id: 'ui-inventory.subjectHeadings' }) }}
                          columnWidths={{ 'Subject headings': '99%' }}
                          formatter={{ 'Subject headings': item => get(item, 'value') || noValue }}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc09"
              label={<FormattedMessage id="ui-inventory.classification" />}
            >
              <Row>
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.classifications">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-classifications"
                          contentData={checkIfArrayIsEmpty(orderedClassifications)}
                          rowMetadata={['classificationTypeId']}
                          visibleColumns={['Classification identifier type', 'Classification']}
                          columnMapping={{
                            'Classification identifier type': intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
                            'Classification': intl.formatMessage({ id: 'ui-inventory.classification' }),
                          }}
                          columnWidths={{
                            'Classification identifier type': '25%',
                            'Classification': '75%',
                          }}
                          formatter={classificationsRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              </Row>
            </Accordion>

            <Accordion
              id="acc10"
              label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
            >
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={childInstancesContentLabel}
                    value={childInstancesContentValue}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={parentInstancesContentLabel}
                    value={parentInstancesContentValue}
                  />
                </Col>
              </Row>
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
        {
          (holdingsrecordid && !itemid)
            ? (
              <this.cViewHoldingsRecord
                id={id}
                holdingsrecordid={holdingsrecordid}
                onCloseViewHoldingsRecord={this.goBack}
                {...this.props}
              />
            )
            : null
        }

        { /*
          related-instances isn't available yet but accordions MUST contain
          child elements. this is commented out for now in an effort to
          keep the console free of warnings.
          <Accordion
            open={this.state.accordions.acc11}
            id="acc11"
            onToggle={this.handleAccordionToggle}
            label={<FormattedMessage id="ui-inventory.relatedInstances" />}
          />
        */ }
        <Callout ref={this.calloutRef} />
      </Pane>
    );
  }
}

ViewInstance.propTypes = {
  getSearchParams: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  getParams: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }),
    holdings: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  okapi: PropTypes.object,
  onClose: PropTypes.func,
  onCopy: PropTypes.func,
  paneWidth: PropTypes.string.isRequired,
  referenceTables: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
  }).isRequired,
  updateLocation: PropTypes.func.isRequired,
};

export default withLocation(ViewInstance);
