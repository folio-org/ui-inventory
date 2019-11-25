import {
  concat,
  filter,
  get,
  has,
  cloneDeep,
  orderBy,
  map,
  omit,
  reject,
  set,
  isEmpty,
  groupBy,
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
import {
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';

import queryString from 'query-string';

import {
  AppIcon,
  TitleManager,
  IntlConsumer,
  IfPermission,
} from '@folio/stripes/core';
import {
  Pane,
  PaneMenu,
  Row,
  Col,
  Button,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Layer,
  Layout,
  PaneHeaderIconButton,
  Icon,
  Headline,
  MultiColumnList,
  Callout,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  areAllFieldsEmpty,
  craftLayerUrl,
  psTitleRelationshipId,
  checkIfElementIsEmpty,
} from './utils';
import formatters from './referenceFormatters';
import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewItem from './ViewItem';
import ViewMarc from './ViewMarc';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';
import { wrappingCell } from './constants';

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
      path: 'source-storage/formattedRecords/:{id}?identifier=INSTANCE',
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
      accordions: {
        acc01: true,
        acc02: true,
        acc03: true,
        acc04: true,
        acc05: true,
        acc06: true,
        acc07: true,
        acc08: true,
        acc09: true,
        acc10: true,
        acc11: true,
      },
      areAllAccordionsOpen: true,
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

  componentDidMount() {
    this.getMARCRecord();
  }

  componentDidUpdate(prevProps) {
    const { location: prevLocation } = prevProps;
    const { location } = this.props;

    if (prevLocation === location) return;
    this.getMARCRecord();
  }

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

  onClickAddNewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.log('clicked "add new holdings record"');
    this.props.updateLocation({ layer: 'createHoldingsRecord' });
  };

  update = (instance) => {
    this.combineRelTitles(instance);
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.resetLayerQueryParam();
    });
  };

  // Combine precedingTitles with parentInstances, and succeedingTitles with childInstances,
  // before saving the instance record
  combineRelTitles = (instance) => {
    // preceding/succeeding titles are stored in parentInstances and childInstances
    // in the instance record and needfrle to be combined with existing relationships here
    // before saving. Each title needs to provide an instance relationship
    // type ID corresponding to 'preceeding-succeeding' in addition to the actual parent
    // instance ID.
    let instanceCopy = instance;
    const titleRelationshipTypeId = psTitleRelationshipId(this.props.resources.instanceRelationshipTypes.records);
    const precedingTitles = map(instanceCopy.precedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    const succeedingTitles = map(instanceCopy.succeedingTitles, p => { p.instanceRelationshipTypeId = titleRelationshipTypeId; return p; });
    set(instanceCopy, 'parentInstances', concat(instanceCopy.parentInstances, precedingTitles));
    set(instanceCopy, 'childInstances', concat(instanceCopy.childInstances, succeedingTitles));
    instanceCopy = omit(instanceCopy, ['precedingTitles', 'succeedingTitles']);
    return instanceCopy;
  };

  // Separate preceding/succeeding title relationships from other types of
  // parent/child instances before displaying the record
  splitRelTitles = (instance) => {
    const instanceCopy = cloneDeep(instance);
    const psRelId = psTitleRelationshipId(this.props.resources.instanceRelationshipTypes.records);
    if (instanceCopy.parentInstances) {
      const parentInstances = reject(instanceCopy.parentInstances, { 'instanceRelationshipTypeId': psRelId });
      const precedingTitles = filter(instanceCopy.parentInstances, { 'instanceRelationshipTypeId': psRelId });
      instance.precedingTitles = instance.precedingTitles || precedingTitles;
      instance.parentInstances = parentInstances;
    }
    if (instanceCopy.childInstances) {
      const childInstances = reject(instanceCopy.childInstances, { 'instanceRelationshipTypeId': psRelId });
      const succeedingTitles = filter(instanceCopy.childInstances, { 'instanceRelationshipTypeId': psRelId });
      instance.succeedingTitles = instance.succeedingTitles || succeedingTitles;
      instance.childInstances = childInstances;
    }
  }

  resetLayerQueryParam = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  };

  closeViewItem = (e) => {
    if (e) e.preventDefault();
    const { goTo, getSearchParams, match: { params: { id } } } = this.props;
    goTo(`/inventory/view/${id}?${getSearchParams()}`);
  };

  closeViewMarc = (e) => {
    if (e) e.preventDefault();
    const { location: { search } } = this.props;
    this.resetLayerQueryParam();
    this.props.goTo(`/inventory/view/${this.props.match.params.id}${search}`);
  };

  closeViewHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.goTo(`/inventory/view/${this.props.match.params.id}`);
  };

  createHoldingsRecord = (holdingsRecord) => {
    // POST holdings record
    this.log(`Creating new holdings record: ${JSON.stringify(holdingsRecord)}`);
    this.props.mutator.holdings.POST(holdingsRecord).then(() => {
      this.resetLayerQueryParam();
    });
  };

  handleAccordionToggle = ({ id }) => {
    this.setState(state => {
      const newState = cloneDeep(state);

      if (!has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];

      return newState;
    });
  };

  handleExpandAll = obj => {
    this.setState(curState => {
      const newState = cloneDeep(curState);

      newState.accordions = obj;
      newState.areAllAccordionsOpen = !newState.areAllAccordionsOpen;

      return newState;
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
        <IfPermission perm="ui-inventory.instance.view">
          {isSourceMARC &&
            <Button
              id="clickable-view-source"
              buttonStyle="dropdownItem"
              onClick={(e) => {
                onToggle();
                this.handleViewSource(e, instance);
              }}
              disabled={!marcRecord}
            >
              <Icon icon="document">
                <FormattedMessage id="ui-inventory.viewSource" />
              </Icon>
            </Button>
          }
        </IfPermission>
      </Fragment>
    );
  };

  isAccordionOpen = (id, hasAllFieldsEmpty) => {
    const {
      accordions,
      areAllAccordionsOpen,
    } = this.state;

    return accordions[id] === !hasAllFieldsEmpty && areAllAccordionsOpen;
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

    const {
      accordions,
      marcRecord
    } = this.state;

    const query = location.search ? queryString.parse(location.search) : {};
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();
    const identifiersRowFormatter = {
      'Resource identifier type': x => get(x, ['identifierType']),
      'Resource identifier': x => get(x, ['value']) || '--',
    };

    const classificationsRowFormatter = {
      'Classification identifier type': x => get(x, ['classificationType']),
      'Classification': x => get(x, ['classificationNumber']) || '--',
    };

    const alternativeTitlesRowFormatter = {
      'Alternative title type': x => this.refLookup(referenceTables.alternativeTitleTypes, get(x, ['alternativeTitleTypeId'])).name,
      'Alternative title': x => get(x, ['alternativeTitle']) || '--',
    };

    const publicationRowFormatter = {
      'Publisher': x => get(x, ['publisher']) || '',
      'Publisher role': x => get(x, ['role']) || '',
      'Place of publication': x => get(x, ['place']) || '',
      'Publication date': x => get(x, ['dateOfPublication']) || '',
    };

    const contributorsRowFormatter = {
      'Name type': x => this.refLookup(referenceTables.contributorNameTypes, get(x, ['contributorNameTypeId'])).name,
      'Name': x => get(x, ['name']),
      'Type': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).name,
      'Code': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).code,
      'Source': x => this.refLookup(referenceTables.contributorTypes, get(x, ['contributorTypeId'])).source,
      'Free text': x => get(x, ['contributorTypeText']) || '',
      'Primary': ({ primary }) => (primary ? <FormattedMessage id="ui-inventory.primary" /> : '')
    };

    const electronicAccessRowFormatter = {
      'URL relationship': x => this.refLookup(referenceTables.electronicAccessRelationships, get(x, ['relationshipId'])).name,
      'URI': x => <a href={get(x, ['uri'])} style={wrappingCell}>{get(x, ['uri'])}</a>,
      'Link text': x => get(x, ['linkText']) || '',
      'Materials specified': x => get(x, ['materialsSpecification']) || '',
      'URL public note': x => get(x, ['publicNote']) || '',
    };

    const formatsRowFormatter = {
      'Category': x => {
        const term = this.refLookup(referenceTables.instanceFormats, x.id).name;
        if (term && term.split('--').length === 2) {
          return term.split('--')[0];
        } else {
          return '';
        }
      },
      'Term': x => {
        const term = this.refLookup(referenceTables.instanceFormats, x.id).name;
        if (term && term.split('--').length === 2) {
          return term.split('--')[1];
        } else {
          return term;
        }
      },
      'Code': x => this.refLookup(referenceTables.instanceFormats, x.id).code,
      'Source': x => this.refLookup(referenceTables.instanceFormats, x.id).source,
    };

    const detailMenu = (
      <IfPermission perm="ui-inventory.instance.edit">
        <PaneMenu>
          <FormattedMessage id="ui-inventory.editInstance">
            {ariaLabel => (
              <PaneHeaderIconButton
                id="clickable-edit-instance"
                style={{ visibility: !instance ? 'hidden' : 'visible' }}
                href={this.craftLayerUrl('edit', location)}
                onClick={this.onClickEditInstance}
                ariaLabel={ariaLabel}
                icon="edit"
              />
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );

    if (!instance) {
      return (
        <Pane
          id="pane-instancedetails"
          defaultWidth={paneWidth}
          paneTitle={<FormattedMessage id="ui-inventory.editInstance" />}
          appIcon={<AppIcon app="inventory" iconKey="instance" />}
          lastMenu={detailMenu}
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

    this.splitRelTitles(instance);

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
                initialValues={instance}
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
          {(intl) => (
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

    const layoutNotes = instanceNotes => {
      return orderBy(instanceNotes, ['noteType.name'], ['asc'])
        .map(({ noteType, notes }) => (
          <MultiColumnList
            contentData={notes}
            visibleColumns={['Staff only', 'Note']}
            columnMapping={{
              'Staff only': <FormattedMessage id="ui-inventory.staffOnly" />,
              'Note': noteType ? noteType.name : <FormattedMessage id="ui-inventory.unknownNoteType" />,
            }}
            columnWidths={{
              'Staff only': '25%',
              'Note': '74%',
            }}
            formatter={{
              'Staff only': x => (get(x, ['staffOnly']) ? <FormattedMessage id="ui-inventory.yes" /> : <FormattedMessage id="ui-inventory.no" />),
              'Note': x => get(x, ['note']) || '',
            }}
            containerRef={ref => { this.resultsList = ref; }}
            interactive={false}
          />
        ));
    };

    const instanceData = {
      instanceHrid: get(instance, ['hrid'], '-'),
      metadataSource: get(instance, ['source'], '-'),
      catalogedDate: get(instance, ['catalogedDate'], '-'),
      instanceStatusTerm: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).name || '-',
      instanceStatusCode: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).code || '-',
      instanceStatusSource: this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).source || '-',
      instanceStatusUpdatedDate: get(instance, ['statusUpdatedDate'], '-'),
      modeOfIssuance: formatters.modesOfIssuanceFormatter(instance, referenceTables.modesOfIssuance) || '-',
      statisticalCodeIds: get(instance, ['statisticalCodeIds'], []),
    };

    const titleData = {
      resourceTitle: get(instance, ['title'], '-'),
      alternativeTitles: get(instance, ['alternativeTitles'], []),
      indexTitle: get(instance, ['indexTitle'], '-'),
      series: get(instance, ['series'], []),
      precedingTitles: get(instance, ['precedingTitles'], []),
      succeedingTitles: get(instance, ['succeedingTitles'], []),
    };

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

    const descriptiveData = {
      publication: get(instance, ['publication'], []),
      editions: get(instance, ['editions'], []),
      physicalDescriptions: get(instance, ['physicalDescriptions'], []),
      resourceTypeTerm: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).name || '-',
      resourceTypeCode: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).code || '-',
      resourceTypeSource: this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).source || '-',
      natureOfContentTermIds: get(instance, ['natureOfContentTermIds'], []),
      instanceFormatIds: get(instance, ['instanceFormatIds'], []),
      languages: get(instance, ['languages'], []),
      publicationFrequency: get(instance, ['publicationFrequency'], []),
      publicationRange: get(instance, ['publicationRange'], []),
    };

    const natureOfContentTermIdsValue = !isEmpty(descriptiveData.natureOfContentTermIds)
      ? descriptiveData.natureOfContentTermIds.map((nocTerm, i) => <div key={i}>{this.refLookup(referenceTables.natureOfContentTerms, nocTerm).name}</div>)
      : '-';

    const publicationFrequencyValue = !isEmpty(descriptiveData.publicationFrequency)
      ? descriptiveData.publicationFrequency.map((desc, i) => <div key={i}>{desc}</div>)
      : '-';

    const publicationRangeValue = !isEmpty(descriptiveData.publicationRange)
      ? descriptiveData.publicationRange.map((desc, i) => <div key={i}>{desc}</div>)
      : '-';

    const sortedNotes = groupBy(get(instance, ['notes'], []), 'instanceNoteTypeId');

    const instanceNotes = map(sortedNotes, (value, key) => {
      const noteType = referenceTables.instanceNoteTypes.find(note => note.id === key);

      return {
        noteType,
        notes: value,
      };
    });

    const electronicAccess = get(instance, ['electronicAccess'], []);

    const subjects = get(instance, ['subjects'], []);

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

    const accordionsState = {
      acc01: areAllFieldsEmpty(Object.values(instanceData)),
      acc02: areAllFieldsEmpty(Object.values(titleData)),
      acc03: areAllFieldsEmpty([identifiers]),
      acc04: areAllFieldsEmpty([contributors]),
      acc05: areAllFieldsEmpty(Object.values(descriptiveData)),
      acc06: areAllFieldsEmpty([instanceNotes]),
      acc07: areAllFieldsEmpty([electronicAccess]),
      acc08: areAllFieldsEmpty([subjects]),
      acc09: areAllFieldsEmpty([classifications]),
      acc10: areAllFieldsEmpty(Object.values(instanceRelationship)),
    };

    const formattedStatusUpdatedDate = (
      <React.Fragment>
        <FormattedDate value={checkIfElementIsEmpty(instanceData.instanceStatusUpdatedDate)} />
        <br />
        <FormattedTime value={checkIfElementIsEmpty(instanceData.instanceStatusUpdatedDate)} />
      </React.Fragment>
    );

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
        lastMenu={detailMenu}
        dismissible
        onClose={onClose}
        actionMenu={this.createActionMenuGetter(instance)}
      >
        <TitleManager record={instance.title} />
        <Row end="xs">
          <Col
            data-test-expand-all
            xs
          >
            <ExpandAllButton
              accordionStatus={accordions}
              onToggle={this.handleExpandAll}
            />
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
                  path="/inventory/(holdings|items|instances)?/view/"
                  render={() => (
                    <this.cHoldings
                      dataKey={id}
                      id={id}
                      accordionToggle={this.handleAccordionToggle}
                      accordionStates={this.state.accordions}
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
          open={this.isAccordionOpen('acc01', accordionsState.acc01)}
          id="acc01"
          onToggle={this.handleAccordionToggle}
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
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceStatusUpdatedDate" />}
                value={formattedStatusUpdatedDate}
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
            {(instanceData.statisticalCodeIds && !isEmpty(instanceData.statisticalCodeIds)) && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.statisticalCodes">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-statistical-codes"
                        contentData={instanceData.statisticalCodeIds.map(codeId => ({ 'codeId': codeId }))}
                        visibleColumns={['Statistical code type', 'Statistical code', 'Statistical code name']}
                        columnMapping={{
                          'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                          'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                          'Statistical code name': intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
                        }}
                        columnWidths={{
                          'Statistical code type': '33%',
                          'Statistical code': '33%',
                          'Statistical code name': '33%',
                        }}
                        formatter={{
                          'Statistical code type':
                            x => this.refLookup(referenceTables.statisticalCodeTypes,
                              this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name,
                          'Statistical code':
                            x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).code,
                          'Statistical code name':
                            x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name,
                        }}
                        ariaLabel={ariaLabel}
                        containerRef={ref => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )}
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc02', accordionsState.acc02)}
          id="acc02"
          onToggle={this.handleAccordionToggle}
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
            {
              !isEmpty(titleData.alternativeTitles) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.alternativeTitles">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-alternative-titles"
                          contentData={titleData.alternativeTitles}
                          rowMetadata={['alternativeTitleTypeId']}
                          visibleColumns={['Alternative title type', 'Alternative title']}
                          columnMapping={{
                            'Alternative title type': intl.formatMessage({ id: 'ui-inventory.alternativeTitleType' }),
                            'Alternative title': intl.formatMessage({ id: 'ui-inventory.alternativeTitle' }),
                          }}
                          columnWidths={{
                            'Alternative title type': '25%',
                            'Alternative title': '25%',
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
              )
            }
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
            {
              !isEmpty(titleData.series) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.seriesStatement">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-series-statement"
                          contentData={titleData.series.map(x => ({ value: x }))}
                          visibleColumns={['Series statement']}
                          columnMapping={{ 'Series statement': intl.formatMessage({ id: 'ui-inventory.seriesStatement' }) }}
                          columnWidths={{ 'Series statement': '99%' }}
                          formatter={{ 'Series statement': x => get(x, ['value']) }}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              )
            }
          </Row>
          {titleData.precedingTitles && !isEmpty(titleData.precedingTitles) && (
            <Row>
              <Col
                data-test-preceding-titles
                xs={12}
              >
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.precedingTitles" />}
                  value={formatters.precedingTitlesFormatter(instance, location)}
                />
              </Col>
            </Row>
          )}
          {titleData.succeedingTitles && !isEmpty(titleData.succeedingTitles) && (
            <Row>
              <Col
                data-test-succeeding-titles
                xs={12}
              >
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.succeedingTitles" />}
                  value={formatters.succeedingTitlesFormatter(instance, location)}
                />
              </Col>
            </Row>
          )}
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc03', accordionsState.acc03)}
          id="acc03"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.identifier" />}
        >
          <Row>
            {
              !isEmpty(identifiers) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.identifiers">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-identifiers"
                          contentData={orderedIdentifiers}
                          rowMetadata={['identifierTypeId']}
                          visibleColumns={['Resource identifier type', 'Resource identifier']}
                          columnMapping={{
                            'Resource identifier type': intl.formatMessage({ id: 'ui-inventory.resourceIdentifierType' }),
                            'Resource identifier': intl.formatMessage({ id: 'ui-inventory.resourceIdentifier' }),
                          }}
                          columnWidths={{
                            'Resource identifier type': '25%',
                            'Resource identifier': '74%',
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
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc04', accordionsState.acc04)}
          id="acc04"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.contributor" />}
        >
          <Row>
            {
              !isEmpty(contributors) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.contributors">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-contributors"
                          contentData={contributors}
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
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc05', accordionsState.acc05)}
          id="acc05"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.descriptiveData" />}
        >
          <Row>
            {
              !isEmpty(descriptiveData.publication) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.publication">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-publication"
                          contentData={descriptiveData.publication}
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
              )
            }
          </Row>
          <br />
          <Row>
            {
              (descriptiveData.editions && !isEmpty(descriptiveData.editions)) && (
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.edition" />}
                    value={descriptiveData.editions.map((edition, i) => <div key={i}>{edition}</div>)}
                  />
                </Col>
              )
            }
            {
              !isEmpty(descriptiveData.physicalDescriptions) && (
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.physicalDescription" />}
                    value={descriptiveData.physicalDescriptions.map((desc, i) => <div key={i}>{desc}</div>)}
                  />
                </Col>
              )
            }
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
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
                value={checkIfElementIsEmpty(natureOfContentTermIdsValue)}
              />
            </Col>
          </Row>

          <Row>
            {
              (descriptiveData.instanceFormatIds && !isEmpty(descriptiveData.instanceFormatIds)) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.formats">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-formats"
                          contentData={descriptiveData.instanceFormatIds.map(formatId => ({ 'id': formatId }))}
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
              )
            }
          </Row>
          {
            !isEmpty(descriptiveData.languages) && (
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.language" />}
                    value={formatters.languagesFormatter(instance)}
                  />
                </Col>
              </Row>
            )
          }
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.publicationFrequency" />}
                value={checkIfElementIsEmpty(publicationFrequencyValue)}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.publicationRange" />}
                value={checkIfElementIsEmpty(publicationRangeValue)}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc06', accordionsState.acc06)}
          id="acc06"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.instanceNotes" />}
        >
          <Row>
            {!isEmpty(instanceNotes) && layoutNotes(instanceNotes)}
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc07', accordionsState.acc07)}
          id="acc07"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.electronicAccess" />}
        >
          <Row>
            {
              !isEmpty(electronicAccess) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.electronicAccess">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-electronic-access"
                          contentData={electronicAccess}
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
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc08', accordionsState.acc08)}
          id="acc08"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.subject" />}
        >
          <Row>
            {
              !isEmpty(subjects) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.subject">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-subject"
                          contentData={subjects.map(item => ({ value: item }))}
                          visibleColumns={['Subject headings']}
                          columnMapping={{ 'Subject headings': intl.formatMessage({ id: 'ui-inventory.subjectHeadings' }) }}
                          columnWidths={{ 'Subject headings': '99%' }}
                          formatter={{ 'Subject headings': item => get(item, 'value', '') }}
                          ariaLabel={ariaLabel}
                          containerRef={ref => { this.resultsList = ref; }}
                          interactive={false}
                        />
                      )}
                    </FormattedMessage>
                  )}
                </IntlConsumer>
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc09', accordionsState.acc09)}
          id="acc09"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.classification" />}
        >
          <Row>
            {
              !isEmpty(classifications) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.classifications">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-classifications"
                          contentData={orderedClassifications}
                          rowMetadata={['classificationTypeId']}
                          visibleColumns={['Classification identifier type', 'Classification']}
                          columnMapping={{
                            'Classification identifier type': intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
                            'Classification': intl.formatMessage({ id: 'ui-inventory.classification' }),
                          }}
                          columnWidths={{
                            'Classification identifier type': '25%',
                            'Classification': '74%',
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
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.isAccordionOpen('acc10', accordionsState.acc10)}
          id="acc10"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
        >
          {!isEmpty(instanceRelationship.childInstances) && (
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.childInstances[0].instanceRelationshipTypeId).name + ' (M)'}
                  value={formatters.childInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)}
                />
              </Col>
            </Row>
          )}
          {!isEmpty(instanceRelationship.parentInstances) && (
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.parentInstances[0].instanceRelationshipTypeId).name}
                  value={formatters.parentInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)}
                />
              </Col>
            </Row>
          )}
        </Accordion>
        {
          (holdingsrecordid && !itemid)
            ? (
              <this.cViewHoldingsRecord
                id={id}
                holdingsrecordid={holdingsrecordid}
                onCloseViewHoldingsRecord={this.closeViewHoldingsRecord}
                {...this.props}
              />
            )
            : null
        }

        {
          (holdingsrecordid && itemid)
            ? (
              <ViewItem
                id={id}
                holdingsRecordId={holdingsrecordid}
                itemId={itemid}
                onCloseViewItem={this.closeViewItem}
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
