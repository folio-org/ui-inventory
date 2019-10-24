import {
  get,
  has,
  cloneDeep,
} from 'lodash';
import React, {
  Fragment,
  createRef,
} from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
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
  PaneMenu,
  Row,
  Col,
  Button,
  Accordion,
  ExpandAllButton,
  KeyValue,
  Layer,
  Layout,
  List,
  PaneHeaderIconButton,
  Icon,
  Headline,
  MultiColumnList,
  Callout,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { craftLayerUrl } from './utils';
import formatters from './referenceFormatters';
import Holdings from './Holdings';
import InstanceForm from './edit/InstanceForm';
import HoldingsForm from './edit/holdings/HoldingsForm';
import ViewHoldingsRecord from './ViewHoldingsRecord';
import ViewItem from './ViewItem';
import ViewMarc from './ViewMarc';
import makeConnectedInstance from './ConnectedInstance';
import withLocation from './withLocation';

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
    this.props.mutator.selectedInstance.PUT(instance).then(() => {
      this.resetLayerQueryParam();
    });
  };

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
    this.setState((state) => {
      const newState = cloneDeep(state);
      if (!has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  };

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.accordions = obj;
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
    const { onCopy, stripes } = this.props;
    const { marcRecord } = this.state;
    const canViewInstance = stripes.hasPerm('ui-inventory.instance.view');

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
        {get(instance, ['source'], '') === 'MARC' &&
          <Button
            id="clickable-view-source"
            data-test-view-source-button
            buttonStyle="dropdownItem"
            onClick={(e) => {
              onToggle();
              this.handleViewSource(e, instance);
            }}
            disabled={!canViewInstance && !marcRecord}
          >
            <Icon icon="document">
              <FormattedMessage id="ui-inventory.viewSource" />
            </Icon>
          </Button>
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

    const query = location.search ? queryString.parse(location.search) : {};
    const ci = makeConnectedInstance(this.props, stripes.logger);
    const instance = ci.instance();
    const identifiersRowFormatter = {
      'Resource identifier type': x => this.refLookup(referenceTables.identifierTypes, get(x, ['identifierTypeId'])).name,
      'Resource identifier': x => get(x, ['value']) || '--',
    };

    const classificationsRowFormatter = {
      'Classification identifier type': x => this.refLookup(referenceTables.classificationTypes, get(x, ['classificationTypeId'])).name,
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
      'URI': x => <a href={get(x, ['uri'])}>{get(x, ['uri'])}</a>,
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

    const layoutNotes = (noteTypes, notes) => {
      return noteTypes
        .filter((noteType) => notes.find(note => note.instanceNoteTypeId === noteType.id))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={2}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={get(instance, ['notes'], []).map((note, j) => {
                    if (note.instanceNoteTypeId === noteType.id) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
              <Col xs={10}>
                <KeyValue
                  label={noteType.name}
                  value={get(instance, ['notes'], []).map((note, j) => {
                    if (note.instanceNoteTypeId === noteType.id) {
                      return <div key={j}>{note.note}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
            </Row>
          );
        });
    };

    const natureOfContentTermIds = get(instance, ['natureOfContentTermIds'], []);

    const detailMenu = (
      <IfPermission perm="ui-inventory.instance.edit">
        <PaneMenu>
          <FormattedMessage id="ui-inventory.editInstance">
            {ariaLabel => (
              <PaneHeaderIconButton
                id="clickable-edit-instance"
                data-test-clickable-edit
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
          <Col xs>
            <ExpandAllButton
              accordionStatus={this.state.accordions}
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

        <Accordion
          open={this.state.accordions.acc01}
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
            <Col xs={2}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceHrid" />}
                value={get(instance, ['hrid'], '')}
              />
            </Col>
            <Col xs={2}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.metadataSource" />}
                value={get(instance, ['source'], '')}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.catalogedDate" />}
                value={get(instance, ['catalogedDate'], '')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceStatusTerm" />}
                value={this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).name}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceStatusCode" />}
                value={this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).code}
              />
            </Col>
            <Col cs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceStatusSource" />}
                value={this.refLookup(referenceTables.instanceStatuses, get(instance, ['statusId'])).source}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.instanceStatusUpdatedDate" />}
                value={get(instance, ['statusUpdatedDate'], '')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
                value={formatters.modesOfIssuanceFormatter(instance, referenceTables.modesOfIssuance)}
              />
            </Col>
          </Row>
          <Row>
            {(instance.statisticalCodeIds && instance.statisticalCodeIds.length > 0) && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.statisticalCodes">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-statistical-codes"
                        contentData={instance.statisticalCodeIds.map((codeId) => { return { 'codeId': codeId }; })}
                        visibleColumns={['Statistical code type', 'Statistical code']}
                        columnMapping={{
                          'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                          'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                        }}
                        formatter={{
                          'Statistical code type':
                            x => this.refLookup(referenceTables.statisticalCodeTypes,
                              this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name,
                          'Statistical code':
                            x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name,
                        }}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
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
          open={this.state.accordions.acc02}
          id="acc02"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.titleData" />}
        >
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.resourceTitle" />}
                value={get(instance, ['title'], '')}
              />
            </Col>
          </Row>
          {
            instance.alternativeTitles.length > 0 && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.alternativeTitles">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-alternative-titles"
                        contentData={instance.alternativeTitles}
                        rowMetadata={['alternativeTitleTypeId']}
                        visibleColumns={['Alternative title type', 'Alternative title']}
                        columnMapping={{
                          'Alternative title type': intl.formatMessage({ id: 'ui-inventory.alternativeTitleType' }),
                          'Alternative title': intl.formatMessage({ id: 'ui-inventory.alternativeTitle' }),
                        }}
                        formatter={alternativeTitlesRowFormatter}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )
          }
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.indexTitle" />}
                value={get(instance, ['indexTitle'], '')}
              />
            </Col>
          </Row>
          <Row>
            {
              instance.series.length > 0 && (
                <Col xs={12}>
                  <KeyValue
                    items={instance.series}
                    value={<List items={instance.series} listStyle="bullets" />}
                    label={<FormattedMessage id="ui-inventory.seriesStatement" />}
                  />
                </Col>
              )
            }
          </Row>
        </Accordion>

        <Accordion
          open={this.state.accordions.acc03}
          id="acc03"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.identifier" />}
        >
          {
            instance.identifiers.length > 0 && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.identifiers">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-identifiers"
                        contentData={instance.identifiers}
                        rowMetadata={['identifierTypeId']}
                        visibleColumns={['Resource identifier type', 'Resource identifier']}
                        columnMapping={{
                          'Resource identifier type': intl.formatMessage({ id: 'ui-inventory.resourceIdentifierType' }),
                          'Resource identifier': intl.formatMessage({ id: 'ui-inventory.resourceIdentifier' }),
                        }}
                        formatter={identifiersRowFormatter}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )
          }
        </Accordion>

        <Accordion
          open={this.state.accordions.acc04}
          id="acc04"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.contributor" />}
        >
          {
            instance.contributors.length > 0 && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.contributors">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-contributors"
                        contentData={instance.contributors}
                        visibleColumns={['Name type', 'Name', 'Type', 'Free text', 'Primary']}
                        columnMapping={{
                          'Name type': intl.formatMessage({ id: 'ui-inventory.nameType' }),
                          'Name': intl.formatMessage({ id: 'ui-inventory.name' }),
                          'Type': intl.formatMessage({ id: 'ui-inventory.type' }),
                          'Free text': intl.formatMessage({ id: 'ui-inventory.freeText' }),
                          'Primary': intl.formatMessage({ id: 'ui-inventory.primary' }),
                        }}
                        formatter={contributorsRowFormatter}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )
          }
        </Accordion>

        <Accordion
          open={this.state.accordions.acc05}
          id="acc05"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.descriptiveData" />}
        >
          {
            instance.publication.length > 0 && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.publication">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-publication"
                        contentData={instance.publication}
                        visibleColumns={['Publisher', 'Publisher role', 'Place of publication', 'Publication date']}
                        columnMapping={{
                          'Publisher': intl.formatMessage({ id: 'ui-inventory.publisher' }),
                          'Publisher role': intl.formatMessage({ id: 'ui-inventory.publisherRole' }),
                          'Place of publication': intl.formatMessage({ id: 'ui-inventory.placeOfPublication' }),
                          'Publication date': intl.formatMessage({ id: 'ui-inventory.dateOfPublication' }),
                        }}
                        formatter={publicationRowFormatter}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )
          }
          <br />
          <Row>
            {
              (instance.editions && instance.editions.length > 0) && (
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.edition" />}
                    value={get(instance, ['editions'], []).map((edition, i) => <div key={i}>{edition}</div>)}
                  />
                </Col>
              )
            }
            {
              (instance.physicalDescriptions.length > 0) && (
                <Col xs={6}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.physicalDescription" />}
                    value={get(instance, ['physicalDescriptions'], []).map((desc, i) => <div key={i}>{desc}</div>)}
                  />
                </Col>
              )
            }
          </Row>

          <Row>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.resourceTypeTerm" />}
                value={this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).name}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.resourceTypeCode" />}
                value={this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).code}
              />
            </Col>
            <Col cs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.resourceTypeSource" />}
                value={this.refLookup(referenceTables.instanceTypes, get(instance, ['instanceTypeId'])).source}
              />
            </Col>
            <Col cs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
                value={natureOfContentTermIds.map((nocTerm, i) => <div key={i}>{this.refLookup(referenceTables.natureOfContentTerms, nocTerm).name}</div>)}
              />
            </Col>
          </Row>

          <Row>
            {
              (instance.instanceFormatIds && instance.instanceFormatIds.length > 0) && (
                <IntlConsumer>
                  {intl => (
                    <FormattedMessage id="ui-inventory.formats">
                      {ariaLabel => (
                        <MultiColumnList
                          id="list-formats"
                          contentData={instance.instanceFormatIds.map((formatId) => { return { 'id': formatId }; })}
                          visibleColumns={['Category', 'Term', 'Code', 'Source']}
                          columnMapping={{
                            'Category': intl.formatMessage({ id: 'ui-inventory.formatCategory' }),
                            'Term': intl.formatMessage({ id: 'ui-inventory.formatTerm' }),
                            'Code': intl.formatMessage({ id: 'ui-inventory.formatCode' }),
                            'Source': intl.formatMessage({ id: 'ui-inventory.formatSource' }),
                          }}
                          formatter={formatsRowFormatter}
                          ariaLabel={ariaLabel}
                          containerRef={(ref) => { this.resultsList = ref; }}
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
            instance.languages.length > 0 && (
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
                value={get(instance, ['publicationFrequency'], []).map((desc, i) => <div key={i}>{desc}</div>)}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory.publicationRange" />}
                value={get(instance, ['publicationRange'], []).map((desc, i) => <div key={i}>{desc}</div>)}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={this.state.accordions.acc06}
          id="acc06"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.instanceNotes" />}
        >
          {layoutNotes(referenceTables.instanceNoteTypes, get(instance, ['notes'], []))}
        </Accordion>

        <Accordion
          open={this.state.accordions.acc07}
          id="acc07"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.electronicAccess" />}
        >
          {
            instance.electronicAccess.length > 0 && (
              <IntlConsumer>
                {intl => (
                  <FormattedMessage id="ui-inventory.electronicAccess">
                    {ariaLabel => (
                      <MultiColumnList
                        id="list-electronic-access"
                        contentData={instance.electronicAccess}
                        visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                        columnMapping={{
                          'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
                          'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
                          'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
                          'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
                          'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
                        }}
                        formatter={electronicAccessRowFormatter}
                        ariaLabel={ariaLabel}
                        containerRef={(ref) => { this.resultsList = ref; }}
                        interactive={false}
                      />
                    )}
                  </FormattedMessage>
                )}
              </IntlConsumer>
            )
          }
        </Accordion>

        <Accordion
          open={this.state.accordions.acc08}
          id="acc08"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.subject" />}
        >
          {
            instance.subjects.length > 0 && (
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.subjectHeadings" />}
                    value={get(instance, ['subjects'], []).map((sub, i) => <div key={i}>{sub}</div>)}
                  />
                </Col>
              </Row>
            )
          }
        </Accordion>

        <Accordion
          open={this.state.accordions.acc09}
          id="acc09"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.classification" />}
        >
          {(instance.classifications.length > 0) && (
            <IntlConsumer>
              {intl => (
                <FormattedMessage id="ui-inventory.classifications">
                  {ariaLabel => (
                    <MultiColumnList
                      id="list-classifications"
                      contentData={instance.classifications}
                      rowMetadata={['classificationTypeId']}
                      visibleColumns={['Classification identifier type', 'Classification']}
                      columnMapping={{
                        'Classification identifier type': intl.formatMessage({ id: 'ui-inventory.classificationIdentifierType' }),
                        'Classification': intl.formatMessage({ id: 'ui-inventory.classification' }),
                      }}
                      formatter={classificationsRowFormatter}
                      ariaLabel={ariaLabel}
                      containerRef={(ref) => { this.resultsList = ref; }}
                      interactive={false}
                    />
                  )}
                </FormattedMessage>
              )}
            </IntlConsumer>
          )}
        </Accordion>

        <Accordion
          open={this.state.accordions.acc10}
          id="acc10"
          onToggle={this.handleAccordionToggle}
          label={<FormattedMessage id="ui-inventory.instanceRelationshipAnalyticsBoundWith" />}
        >
          {instance.childInstances.length > 0 && (
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={referenceTables.instanceRelationshipTypes.find(irt => irt.id === instance.childInstances[0].instanceRelationshipTypeId).name + ' (M)'}
                  value={formatters.childInstancesFormatter(instance, referenceTables.instanceRelationshipTypes, location)}
                />
              </Col>
            </Row>
          )}
          {instance.parentInstances.length > 0 && (
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
          (!holdingsrecordid && !itemid)
            ? (
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

        <Row>
          <Col sm={12}>{newHoldingsRecordButton}</Col>
        </Row>
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
