import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import queryString from 'query-string';

import {
  Layer,
  Pane,
  PaneMenu,
  Row,
  Col,
  Accordion,
  ExpandAllButton,
  KeyValue,
  PaneHeaderIconButton,
  MultiColumnList,
  Icon,
  Button,
  Modal,
  ConfirmationModal,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer
} from '@folio/stripes/core';

import { craftLayerUrl } from './utils';
import HoldingsForm from './edit/holdings/HoldingsForm';
import withLocation from './withLocation';

class ViewHoldingsRecord extends React.Component {
  static manifest = Object.freeze({
    query: {},
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      POST: {
        path: 'holdings-storage/holdings',
      },
    },
    items: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      params: {
        query: '(holdingsRecordId==:{holdingsrecordid})',
        limit: '5000',
      },
      resourceShouldRefresh: true,
    },
    instances1: {
      type: 'okapi',
      path: 'inventory/instances/:{id}',
    },
    permanentLocation: {
      type: 'okapi',
      path: 'locations/%{permanentLocationQuery.id}',
    },
    temporaryLocation: {
      type: 'okapi',
      path: 'locations/%{temporaryLocationQuery.id}',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      accordions: {
        accordion01: true,
        accordion02: true,
        accordion03: true,
        accordion04: true,
        accordion05: true,
        accordion06: true,
        accordion07: true,
      },
      confirmHoldingsRecordDeleteModal: false,
      noHoldingsRecordDeleteModal: false,
    };
    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  static getDerivedStateFromProps(nextProps) {
    const { resources } = nextProps;
    const holdingsRecords = (resources.holdingsRecords || {}).records || [];
    const permanentLocationQuery = resources.permanentLocationQuery;
    const temporaryLocationQuery = resources.temporaryLocationQuery;
    const holding = holdingsRecords[0];

    if (holding && holding.permanentLocationId && permanentLocationQuery
      && (!permanentLocationQuery.id || permanentLocationQuery.id !== holding.permanentLocationId)) {
      nextProps.mutator.permanentLocationQuery.update({ id: holding.permanentLocationId });
    }
    if (holding && holding.temporaryLocationId && temporaryLocationQuery
      && (!temporaryLocationQuery.id || temporaryLocationQuery.id !== holding.temporaryLocationId)) {
      nextProps.mutator.temporaryLocationQuery.update({ id: holding.temporaryLocationId });
    }

    return null;
  }

  // Edit Holdings records handlers
  onClickEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: 'editHoldingsRecord' });
  }

  onClickCloseEditHoldingsRecord = (e) => {
    if (e) e.preventDefault();
    this.props.updateLocation({ layer: null });
  }

  updateHoldingsRecord = (holdingsRecord) => {
    const holdings = holdingsRecord;
    if (holdings.permanentLocationId === '') delete holdings.permanentLocationId;
    this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
      this.onClickCloseEditHoldingsRecord();
    });
  }

  copyHoldingsRecord = (holdingsRecord) => {
    const { resources: { instances1 } } = this.props;
    const instance = instances1.records[0];

    this.props.mutator.holdingsRecords.POST(holdingsRecord).then((data) => {
      this.props.goTo(`/inventory/view/${instance.id}/${data.id}`);
    });
  }

  deleteHoldingsRecord = (holdingsRecord) => {
    this.props.onCloseViewHoldingsRecord();
    this.props.mutator.holdingsRecords.DELETE(holdingsRecord);
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);
      newState.accordions = obj;
      return newState;
    });
  }

  onCopy(record) {
    this.setState((state) => {
      const newState = _.cloneDeep(state);
      newState.copiedRecord = _.omit(record, ['id', 'hrid']);
      return newState;
    });

    this.props.updateLocation({ layer: 'copyHoldingsRecord' });
  }

  hideConfirmHoldingsRecordDeleteModal = () => {
    this.setState({ confirmHoldingsRecordDeleteModal: false });
  }

  hideNoHoldingsRecordDeleteModal = () => {
    this.setState({ noHoldingsRecordDeleteModal: false });
  }

  canDeleteHoldingsRecord = () => {
    const itemCount = _.get(this.props.resources, 'items.records.length', 0);
    return (itemCount === 0);
  }

  refLookup = (referenceTable, id) => {
    const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
    return ref || {};
  }

  getPaneHeaderActionMenu = ({ onToggle }) => {
    const {
      resources,
    } = this.props;

    const firstRecordOfHoldings = resources.holdingsRecords.records[0];

    return (
      <Fragment>
        <Button
          id="clickable-delete-holdingsrecord"
          onClick={() => {
            onToggle();
            this.setState(this.canDeleteHoldingsRecord(firstRecordOfHoldings) ?
              { confirmHoldingsRecordDeleteModal: true } : { noHoldingsRecordDeleteModal: true });
          }}
          buttonStyle="dropdownItem"
          data-test-inventory-delete-holdingsrecord-action
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-inventory.deleteHoldingsRecord" />
          </Icon>
        </Button>
        <Button
          id="edit-holdings"
          onClick={() => {
            onToggle();
            this.onClickEditHoldingsRecord();
          }}
          href={this.craftLayerUrl('editHoldingsRecord')}
          buttonStyle="dropdownItem"
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-inventory.editHoldings" />
          </Icon>
        </Button>
        <Button
          id="copy-holdings"
          onClick={() => {
            onToggle();
            this.onCopy(firstRecordOfHoldings);
          }}
          buttonStyle="dropdownItem"
        >
          <Icon icon="duplicate">
            <FormattedMessage id="ui-inventory.duplicateHoldings" />
          </Icon>
        </Button>
      </Fragment>
    );
  }

  isAwaitingResource = () => {
    const {
      holdingsRecords,
      instances1,
      permanentLocation,
      temporaryLocation,
    } = this.props.resources;

    const {
      holdingsTypes,
      holdingsNoteTypes,
      illPolicies,
      callNumberTypes,
    } = this.props.parentResources;

    if (!holdingsRecords || !holdingsRecords.hasLoaded) {
      return true;
    }

    const holdingsRecord = holdingsRecords.records[0];

    if (!instances1 || !instances1.hasLoaded
      || (holdingsRecord.permanentLocationId && (!permanentLocation || !permanentLocation.hasLoaded))
      || (holdingsRecord.temporaryLocationId && (!temporaryLocation || !temporaryLocation.hasLoaded))
      || !illPolicies || !illPolicies.hasLoaded
      || !holdingsTypes || !holdingsTypes.hasLoaded
      || !callNumberTypes || !callNumberTypes.hasLoaded
      || !holdingsNoteTypes || !holdingsNoteTypes.hasLoaded) {
      return true;
    }

    return false;
  };

  render() {
    const {
      location,
      resources: {
        holdingsRecords,
        instances1,
        permanentLocation,
        temporaryLocation,
        items,
      },
      parentResources: {
        holdingsTypes,
        holdingsNoteTypes,
        illPolicies,
        callNumberTypes,
      },
      referenceTables,
      okapi,
    } = this.props;

    if (this.isAwaitingResource()) {
      return <FormattedMessage id="ui-inventory.holdingsRecord.awaitingResources" />;
    }

    const instance = instances1.records[0];
    const holdingsRecord = holdingsRecords.records[0];
    const holdingsPermanentLocation = holdingsRecord.permanentLocationId ? permanentLocation.records[0] : null;
    const holdingsTemporaryLocation = holdingsRecord.temporaryLocationId ? temporaryLocation.records[0] : null;
    const itemCount = _.get(items, 'records.length', 0);

    referenceTables.illPolicies = illPolicies.records;
    referenceTables.holdingsTypes = holdingsTypes.records;
    referenceTables.callNumberTypes = callNumberTypes.records;
    referenceTables.holdingsNoteTypes = holdingsNoteTypes.records;

    const query = location.search ? queryString.parse(location.search) : {};

    const detailMenu = (
      <PaneMenu>
        <FormattedMessage id="ui-inventory.editHoldings">
          {ariaLabel => (
            <PaneHeaderIconButton
              icon="edit"
              id="clickable-edit-holdingsrecord"
              style={{ visibility: !holdingsRecord ? 'hidden' : 'visible' }}
              href={this.craftLayerUrl('editHoldingsRecord')}
              onClick={this.onClickEditHoldingsRecord}
              ariaLabel={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );

    const layoutNotes = (noteTypes, notes) => {
      return noteTypes
        .filter((noteType) => notes.find(note => note.holdingsNoteTypeId === noteType.id))
        .map((noteType, i) => {
          return (
            <Row key={i}>
              <Col xs={1}>
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.staffOnly" />}
                  value={_.get(holdingsRecord, ['notes'], []).map((note, j) => {
                    if (note.holdingsNoteTypeId === noteType.id) {
                      return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                    }
                    return null;
                  })}
                />
              </Col>
              <Col xs={11}>
                <KeyValue
                  label={noteType.name}
                  value={_.get(holdingsRecord, ['notes'], []).map((note, j) => {
                    if (note.holdingsNoteTypeId === noteType.id) {
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

    const confirmHoldingsRecordDeleteModalMessage = (
      <SafeHTMLMessage
        id="ui-inventory.confirmHoldingsRecordDeleteModal.message"
        values={{
          hrid: holdingsRecord.hrid,
          location: (holdingsPermanentLocation ? holdingsPermanentLocation.name : null)
        }}
      />
    );

    const noHoldingsRecordDeleteModalMessageId = itemCount > 1
      ? 'ui-inventory.itemsOnHoldingsRecordDeleteModal.message'
      : 'ui-inventory.itemOnHoldingsRecordDeleteModal.message';

    const noHoldingsRecordDeleteModalMessage = (
      <SafeHTMLMessage
        id={noHoldingsRecordDeleteModalMessageId}
        values={{
          hrid: holdingsRecord.hrid,
          location: (holdingsPermanentLocation ? holdingsPermanentLocation.name : null),
          itemCount,
        }}
      />
    );

    const noHoldingsRecordDeleteFooter = (
      <Button onClick={this.hideNoHoldingsRecordDeleteModal}>
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    return (
      <div>
        <ConfirmationModal
          id="delete-confirmation-modal"
          open={this.state.confirmHoldingsRecordDeleteModal}
          heading={<FormattedMessage id="ui-inventory.confirmHoldingsRecordDeleteModal.heading" />}
          message={confirmHoldingsRecordDeleteModalMessage}
          onConfirm={() => { this.deleteHoldingsRecord(holdingsRecord); }}
          onCancel={this.hideConfirmHoldingsRecordDeleteModal}
          confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
        />
        <Modal
          data-test-no-delete-holdingsrecord-modal
          label={<FormattedMessage id="ui-inventory.confirmHoldingsRecordDeleteModal.heading" />}
          open={this.state.noHoldingsRecordDeleteModal}
          footer={noHoldingsRecordDeleteFooter}
        >
          {noHoldingsRecordDeleteModalMessage}
        </Modal>
        <Layer
          isOpen
          contentLabel={<FormattedMessage id="ui-inventory.viewHoldingsRecord" />}
        >
          <div data-test-holdings-view-page>
            <Pane
              defaultWidth={this.props.paneWidth}
              appIcon={<AppIcon app="inventory" iconKey="holdings" />}
              paneTitle={
                <span data-test-header-title>
                  <FormattedMessage
                    id="ui-inventory.holdingRecord"
                    values={{
                      location: _.get(holdingsPermanentLocation, 'name', ''),
                      callNumber: _.get(holdingsRecord, 'callNumber', '')
                    }}
                  />
                </span>
              }
              lastMenu={detailMenu}
              dismissible
              onClose={this.props.onCloseViewHoldingsRecord}
              actionMenu={this.getPaneHeaderActionMenu}
            >
              <Row center="xs">
                <Col sm={6}>
                  <FormattedMessage id="ui-inventory.instance" />
                  {instance.title}
                  {(instance.publication && instance.publication.length > 0) &&
                    <span>
                      <em>, </em>
                      <em>
                        {instance.publication[0].publisher}
                        {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                      </em>
                    </span>
                  }
                </Col>
              </Row>
              <hr />
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={this.state.accordions}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
              <Accordion
                open={this.state.accordions.accordion01}
                id="accordion01"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.administrativeData" />}
              >
                {(holdingsRecord.metadata && holdingsRecord.metadata.createdDate) &&
                  <this.cViewMetaData metadata={holdingsRecord.metadata} />
                }
                <Row>
                  <Col xs={12}>
                    {holdingsRecord.discoverySuppress && <FormattedMessage id="ui-inventory.discoverySuppress" />}
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.holdingsHrid" />}
                      value={_.get(holdingsRecord, ['hrid'], '')}
                    />
                  </Col>
                  <Col>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.formerHoldingsId" />}
                      value={_.get(holdingsRecord, ['formerIds'], []).map((hid, i) => <div key={i}>{hid}</div>)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.holdingsType" />}
                      value={this.refLookup(referenceTables.holdingsTypes, _.get(holdingsRecord, ['holdingsTypeId'])).name}
                    />
                  </Col>
                </Row>
                <Row>
                  {(holdingsRecord.statisticalCodeIds && holdingsRecord.statisticalCodeIds.length > 0) && (
                    <IntlConsumer>
                      {intl => (
                        <FormattedMessage id="ui-inventory.statisticalCodes">
                          {ariaLabel => (
                            <MultiColumnList
                              id="list-statistical-codes"
                              contentData={holdingsRecord.statisticalCodeIds.map((id) => { return { 'codeId': id }; })}
                              visibleColumns={['Statistical code type', 'Statistical code']}
                              columnMapping={{
                                'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                                'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                              }}
                              formatter={{
                                'Statistical code type':
                                  x => this.refLookup(referenceTables.statisticalCodeTypes,
                                    this.refLookup(referenceTables.statisticalCodes, _.get(x, ['codeId'])).statisticalCodeTypeId).name,
                                'Statistical code':
                                  x => this.refLookup(referenceTables.statisticalCodes, _.get(x, ['codeId'])).name,
                              }}
                              ariaLabel={ariaLabel}
                              containerRef={(ref) => { this.resultsList = ref; }}
                            />
                          )}
                        </FormattedMessage>
                      )}
                    </IntlConsumer>
                  )}
                </Row>

              </Accordion>
              <Accordion
                open={this.state.accordions.accordion02}
                id="accordion02"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.locations" />}
              >
                <Row>
                  <Col smOffset={0} sm={4}>
                    <strong>
                      <FormattedMessage id="ui-inventory.holdingsLocation" />
                    </strong>
                  </Col>
                </Row>
                <br />
                {((holdingsRecord.permanentLocationId) || (holdingsRecord.temporaryLocationId)) &&
                  <Row>
                    <Col
                      smOffset={0}
                      sm={4}
                    >
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.permanent" />}
                        value={holdingsPermanentLocation.name}
                      />
                    </Col>
                    <Col>
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.temporary" />}
                        value={holdingsTemporaryLocation ? holdingsTemporaryLocation.name : '-'}
                      />
                    </Col>
                  </Row>
                }
                <Row>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                      value={holdingsRecord.shelvingOrder}
                    />
                  </Col>
                  <Col>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.shelvingTitle" />}
                      value={holdingsRecord.shelvingTitle}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <strong>
                      <FormattedMessage id="ui-inventory.holdingsCallNumber" />
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.copyNumber" />}
                      value={holdingsRecord.copyNumber}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberType" />}
                      value={this.refLookup(referenceTables.callNumberTypes, _.get(holdingsRecord, ['callNumberTypeId'])).name}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                      value={holdingsRecord.callNumberPrefix}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumber" />}
                      value={holdingsRecord.callNumber}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                      value={holdingsRecord.callNumberSuffix}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion03}
                id="accordion03"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.holdingsDetails" />}
              >
                <KeyValue
                  label={<FormattedMessage id="ui-inventory.numberOfItems" />}
                  value={_.get(holdingsRecord, ['numberOfItems'], [])}
                />
                {(holdingsRecord.holdingsStatements.length > 0) && (
                  <IntlConsumer>
                    {intl => (
                      <FormattedMessage id="ui-inventory.holdingsStatements">
                        {ariaLabel => (
                          <MultiColumnList
                            id="list-holdingsstatements"
                            contentData={holdingsRecord.holdingsStatements}
                            visibleColumns={['Holdings statement', 'Holdings statement note']}
                            columnMapping={{
                              'Holdings statement': intl.formatMessage({ id: 'ui-inventory.holdingsStatement' }),
                              'Holdings statement note': intl.formatMessage({ id: 'ui-inventory.holdingsStatementNote' }),
                            }}
                            formatter={{
                              'Holdings statement': x => _.get(x, ['statement']) || '',
                              'Holdings statement note': x => _.get(x, ['note']) || '',
                            }}
                            ariaLabel={ariaLabel}
                            containerRef={(ref) => { this.resultsList = ref; }}
                          />
                        )}
                      </FormattedMessage>
                    )}
                  </IntlConsumer>
                )}
                {(holdingsRecord.holdingsStatementsForSupplements.length > 0) && (
                  <IntlConsumer>
                    {intl => (
                      <FormattedMessage id="ui-inventory.holdingsStatementForSupplements">
                        {ariaLabel => (
                          <MultiColumnList
                            id="list-holdingsstatementsforsupplements"
                            contentData={holdingsRecord.holdingsStatementsForSupplements}
                            visibleColumns={['Holdings statement for supplements', 'Holdings statement for supplements note']}
                            columnMapping={{
                              'Holdings statement for supplements': intl.formatMessage({ id: 'ui-inventory.holdingsStatementForSupplements' }),
                              'Holdings statement for supplements note': intl.formatMessage({ id: 'ui-inventory.holdingsStatementForSupplementsNote' }),
                            }}
                            formatter={{
                              'Holdings statement for supplements': x => _.get(x, ['statement']) || '',
                              'Holdings statement for supplements note': x => _.get(x, ['note']) || '',
                            }}
                            ariaLabel={ariaLabel}
                            containerRef={(ref) => { this.resultsList = ref; }}
                          />
                        )}
                      </FormattedMessage>
                    )}
                  </IntlConsumer>
                )}

                {(holdingsRecord.holdingsStatementsForIndexes.length > 0) && (
                  <IntlConsumer>
                    {intl => (
                      <FormattedMessage id="ui-inventory.holdingsStatementForIndexes">
                        {ariaLabel => (
                          <MultiColumnList
                            id="list-holdingsstatementsforindexes"
                            contentData={holdingsRecord.holdingsStatementsForIndexes}
                            visibleColumns={['Holdings statement for indexes', 'Holdings statement for indexes note']}
                            columnMapping={{
                              'Holdings statement for indexes': intl.formatMessage({ id: 'ui-inventory.holdingsStatementForIndexes' }),
                              'Holdings statement for indexes note': intl.formatMessage({ id: 'ui-inventory.holdingsStatementForIndexesNote' }),
                            }}
                            formatter={{
                              'Holdings statement for indexes': x => _.get(x, ['statement']) || '',
                              'Holdings statement for indexes note': x => _.get(x, ['note']) || '',
                            }}
                            ariaLabel={ariaLabel}
                            containerRef={(ref) => { this.resultsList = ref; }}
                          />
                        )}
                      </FormattedMessage>
                    )}
                  </IntlConsumer>
                )}
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.illPolicy" />}
                      value={this.refLookup(referenceTables.illPolicies, _.get(holdingsRecord, ['illPolicyId'])).name}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.digitizationPolicy" />}
                      value={_.get(holdingsRecord, ['digitizationPolicy'], '')}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.retentionPolicy" />}
                      value={_.get(holdingsRecord, ['retentionPolicy'], '')}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion04}
                id="accordion04"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.notes" />}
              >
                {layoutNotes(referenceTables.holdingsNoteTypes, _.get(holdingsRecord, ['notes'], []))}
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion05}
                id="accordion05"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.acquisitions" />}
              >
                <Row>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.acquisitionMethod" />}
                      value={_.get(holdingsRecord, ['acquisitionMethod'], '')}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.acquisitionFormat" />}
                      value={_.get(holdingsRecord, ['acquisitionFormat'], '')}
                    />
                  </Col>
                  <Col sm={3}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.receiptStatus" />}
                      value={_.get(holdingsRecord, ['receiptStatus'], '')}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion06}
                id="accordion06"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.electronicAccess" />}
              >
                {(holdingsRecord.electronicAccess.length > 0) && (
                  <IntlConsumer>
                    {intl => (
                      <FormattedMessage id="ui-inventory.electronicAccess">
                        {ariaLabel => (
                          <MultiColumnList
                            id="list-electronic-access"
                            contentData={holdingsRecord.electronicAccess}
                            visibleColumns={['URL relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']}
                            columnMapping={{
                              'URL relationship': intl.formatMessage({ id: 'ui-inventory.URLrelationship' }),
                              'URI': intl.formatMessage({ id: 'ui-inventory.uri' }),
                              'Link text': intl.formatMessage({ id: 'ui-inventory.linkText' }),
                              'Materials specified': intl.formatMessage({ id: 'ui-inventory.materialsSpecification' }),
                              'URL public note': intl.formatMessage({ id: 'ui-inventory.urlPublicNote' }),
                            }}
                            formatter={{
                              'URL relationship': x => this.refLookup(referenceTables.electronicAccessRelationships, _.get(x, ['relationshipId'])).name,
                              'URI': x => <a href={_.get(x, ['uri'])}>{_.get(x, ['uri'])}</a>,
                              'Link text': x => _.get(x, ['linkText']) || '',
                              'Materials specified': x => _.get(x, ['materialsSpecification']) || '',
                              'URL public note': x => _.get(x, ['publicNote']) || '',
                            }}
                            ariaLabel={ariaLabel}
                            containerRef={(ref) => { this.resultsList = ref; }}
                          />
                        )}
                      </FormattedMessage>
                    )}
                  </IntlConsumer>
                )}
              </Accordion>
              <Accordion
                open={this.state.accordions.accordion07}
                id="accordion07"
                onToggle={this.handleAccordionToggle}
                label={<FormattedMessage id="ui-inventory.receivingHistory" />}
              >
                {(holdingsRecord.receivingHistory
                  && holdingsRecord.receivingHistory.entries
                  && holdingsRecord.receivingHistory.entries.length > 0)
                  && (
                    <IntlConsumer>
                      {intl => (
                        <FormattedMessage id="ui-inventory.receivingHistory">
                          {ariaLabel => (
                            <MultiColumnList
                              id="list-retrieving-history"
                              contentData={holdingsRecord.receivingHistory.entries}
                              visibleColumns={['Enumeration', 'Chronology']}
                              columnMapping={{
                                'Enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
                                'Chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
                              }}
                              formatter={{
                                'Enumeration': x => x.enumeration,
                                'Chronology': x => x.chronology,
                              }}
                              ariaLabel={ariaLabel}
                              containerRef={(ref) => { this.resultsList = ref; }}
                            />
                          )}
                        </FormattedMessage>
                      )}
                    </IntlConsumer>
                  )
                }
              </Accordion>
            </Pane>
          </div>
        </Layer>
        <Layer
          isOpen={query.layer ? (query.layer === 'editHoldingsRecord') : false}
          contentLabel={<FormattedMessage id="ui-inventory.editHoldingsRecordDialog" />}
        >
          <HoldingsForm
            initialValues={holdingsRecord}
            onSubmit={(record) => this.updateHoldingsRecord(record)}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            instance={instance}
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
        <Layer
          isOpen={query.layer ? (query.layer === 'copyHoldingsRecord') : false}
          contentLabel={<FormattedMessage id="ui-inventory.copyHoldingsRecordDialog" />}
        >
          <HoldingsForm
            initialValues={this.state.copiedRecord}
            onSubmit={(record) => this.copyHoldingsRecord(record)}
            onCancel={this.onClickCloseEditHoldingsRecord}
            okapi={okapi}
            instance={instance}
            copy
            referenceTables={referenceTables}
            stripes={this.props.stripes}
          />
        </Layer>
      </div>
    );
  }
}

ViewHoldingsRecord.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
  parentResources: PropTypes.shape({
    holdingsTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    illPolicies: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    callNumberTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsNoteTypes: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  resources: PropTypes.shape({
    instances1: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    permanentLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    temporaryLocation: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  okapi: PropTypes.object,
  location: PropTypes.object,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    holdingsRecords: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
    permanentLocationQuery: PropTypes.object.isRequired,
    temporaryLocationQuery: PropTypes.object.isRequired,
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};


export default withLocation(ViewHoldingsRecord);
