import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
  cloneDeep,
  omit,
  orderBy,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import queryString from 'query-string';

import {
  Layer,
  Pane,
  Row,
  Col,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  KeyValue,
  MultiColumnList,
  Icon,
  Button,
  Modal,
  ConfirmationModal,
  TextField,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  ClipCopy,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer,
} from '@folio/stripes/core';

import {
  craftLayerUrl,
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  callNumberLabel,
  checkIfArrayIsEmpty,
  staffOnlyFormatter,
  getSortedNotes,
} from './utils';
import HoldingsForm from './edit/holdings/HoldingsForm';
import withLocation from './withLocation';
import {
  wrappingCell,
  emptyList,
  noValue,
  holdingsStatementTypes,
} from './constants';
import { WarningMessage } from './components';

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
    tagSettings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==TAGS and configName==tags_enabled)',
    },
  });

  constructor(props) {
    super(props);
    this.state = {
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
    if (holdings.temporaryLocationId === '') delete holdings.temporaryLocationId;

    return this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
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

  onCopy(record) {
    this.setState((state) => {
      const newState = cloneDeep(state);
      newState.copiedRecord = omit(record, ['id', 'hrid', 'formerIds']);
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
    const itemCount = get(this.props.resources, 'items.records.length', 0);
    return (itemCount === 0);
  }

  refLookup = (referenceTable, id) => {
    const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};
    return ref || {};
  }

  getPaneHeaderActionMenu = ({ onToggle }) => {
    const {
      resources,
      stripes,
    } = this.props;

    const canCreate = stripes.hasPerm('ui-inventory.holdings.create');
    const canEdit = stripes.hasPerm('ui-inventory.holdings.edit');
    const canDelete = stripes.hasPerm('ui-inventory.holdings.delete');

    if (!canCreate && !canEdit && !canDelete) {
      return null;
    }

    const firstRecordOfHoldings = resources.holdingsRecords.records[0];

    return (
      <>
        {
          canEdit &&
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
        }
        {
          canCreate &&
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
        }
        {
          canDelete &&
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
        }
      </>
    );
  };

  isAwaitingResource = () => {
    const {
      holdingsRecords,
      instances1,
      permanentLocation,
      temporaryLocation,
    } = this.props.resources;

    if (!holdingsRecords || !holdingsRecords.hasLoaded) {
      return true;
    }

    const holdingsRecord = holdingsRecords.records[0];

    if (!instances1 || !instances1.hasLoaded
      || (holdingsRecord.permanentLocationId && (!permanentLocation || !permanentLocation.hasLoaded))
      || (holdingsRecord.temporaryLocationId && (!temporaryLocation || !temporaryLocation.hasLoaded))) {
      return true;
    }

    return false;
  };

  getEntity = () => this.props.resources.holdingsRecords.records[0];
  getEntityTags = () => this.props.resources.holdingsRecords.records[0]?.tags?.tagList || [];

  render() {
    const {
      location,
      resources: {
        holdingsRecords,
        instances1,
        permanentLocation,
        temporaryLocation,
        items,
        tagSettings,
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
    const itemCount = get(items, 'records.length', 0);
    const query = location.search ? queryString.parse(location.search) : {};
    const holdingsSourceName = referenceTables?.holdingsSourcesByName?.FOLIO?.name;
    const tagsEnabled = !tagSettings?.records?.length || tagSettings?.records?.[0]?.value === 'true';

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

    const administrativeData = {
      holdingsHrid: get(holdingsRecord, ['hrid'], '-'),
      formerHoldingsId: get(holdingsRecord, ['formerIds'], []),
      holdingsType: this.refLookup(referenceTables.holdingsTypes, get(holdingsRecord, ['holdingsTypeId'])).name || '-',
      statisticalCodeIds: get(holdingsRecord, ['statisticalCodeIds'], []),
    };

    const formerHoldingsIdValue = !isEmpty(administrativeData.formerHoldingsId)
      ? administrativeData.formerHoldingsId.map((hid, i) => <div key={i}>{hid || noValue}</div>)
      : noValue;

    const statisticalCodeIdsContent = !isEmpty(administrativeData.statisticalCodeIds)
      ? administrativeData.statisticalCodeIds.map(id => ({ 'codeId': id }))
      : emptyList;

    const locationAccordion = {
      permanent: get(holdingsPermanentLocation, ['name'], '-'),
      temporary: get(holdingsTemporaryLocation, ['name'], '-'),
      shelvingOrder: get(holdingsRecord, ['shelvingOrder'], '-'),
      shelvingTitle: get(holdingsRecord, ['shelvingTitle'], '-'),
      copyNumber: get(holdingsRecord, ['copyNumber'], '-'),
      callNumberType: this.refLookup(referenceTables.callNumberTypes, get(holdingsRecord, ['callNumberTypeId'])).name || '-',
      callNumberPrefix: get(holdingsRecord, ['callNumberPrefix'], '-'),
      callNumber: get(holdingsRecord, ['callNumber'], '-'),
      callNumberSuffix: get(holdingsRecord, ['callNumberSuffix'], '-'),
    };

    const holdingsDetails = {
      numberOfItems: get(holdingsRecord, ['numberOfItems'], '-'),
      holdingsStatement: get(holdingsRecord, ['holdingsStatements'], []),
      holdingsStatementForSupplements: get(holdingsRecord, ['holdingsStatementsForSupplements'], []),
      holdingsStatementForIndexes: get(holdingsRecord, ['holdingsStatementsForIndexes'], []),
      illPolicy: this.refLookup(referenceTables.illPolicies, get(holdingsRecord, ['illPolicyId'])).name || '-',
      digitizationPolicy: get(holdingsRecord, ['digitizationPolicy'], '-'),
      retentionPolicy: get(holdingsRecord, ['retentionPolicy'], '-'),
    };

    const holdingsNotes = getSortedNotes(holdingsRecord, 'holdingsNoteTypeId', referenceTables.holdingsNoteTypes);

    const electronicAccess = get(holdingsRecord, ['electronicAccess'], []);

    const acquisition = {
      acquisitionMethod: get(holdingsRecord, ['acquisitionMethod'], '-'),
      acquisitionFormat: get(holdingsRecord, ['acquisitionFormat'], '-'),
      receiptStatus: get(holdingsRecord, ['receiptStatus'], '-'),
    };

    const receivingHistory = get(holdingsRecord, ['receivingHistory', 'entries'], []);

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(Object.values(administrativeData)),
      acc02: !areAllFieldsEmpty(Object.values(locationAccordion)),
      acc03: !areAllFieldsEmpty(Object.values(holdingsDetails)),
      acc04: !areAllFieldsEmpty([holdingsNotes]),
      acc05: !areAllFieldsEmpty([electronicAccess]),
      acc06: !areAllFieldsEmpty(Object.values(acquisition)),
      acc07: !areAllFieldsEmpty([receivingHistory]),
    };

    const holdingsDetailsTables = intl => holdingsStatementTypes.map(({ type, title }) => ({
      id: `list-${type}`,
      contentData: checkIfArrayIsEmpty(holdingsDetails[type]),
      visibleColumns: [
        title,
        `${title} public note`,
        `${title} staff note`,
      ],
      columnMapping: {
        [title]: intl.formatMessage({ id: `ui-inventory.${type}` }),
        [`${title} public note`]: intl.formatMessage({ id: `ui-inventory.${type}PublicNote` }),
        [`${title} staff note`]: intl.formatMessage({ id: `ui-inventory.${type}StaffNote` }),
      },
      columnWidths: {
        [title]: '16%',
        [`${title} public note`]: '42%',
        [`${title} staff note`]: '42%',
      },
      formatter: {
        [title]: x => x?.statement || noValue,
        [`${title} public note`]: x => x?.note || noValue,
        [`${title} staff note`]:  x => x?.staffNote || noValue,
      },
      ariaLabel: intl.formatMessage({ id: `ui-inventory.${type}` })
    }));

    const layoutNotes = content => {
      const notesList = isEmpty(content) ? emptyList : content;
      const orderedNotes = orderBy(notesList, ['noteType.name'], ['asc']);

      return orderedNotes.map(({ noteType, notes }, i) => {
        const noteName = noteType ? noteType.name : <FormattedMessage id="ui-inventory.unknownNoteType" />;
        const notesContent = notesList === emptyList ? emptyList : notes;

        return (
          <Row key={i}>
            <MultiColumnList
              key={i}
              id={`list-holdings-notes-${i}`}
              contentData={checkIfArrayIsEmpty(notesContent)}
              visibleColumns={['Staff only', 'Note']}
              columnMapping={{
                'Staff only': <FormattedMessage id="ui-inventory.staffOnly" />,
                'Note': notesList === emptyList ? <FormattedMessage id="ui-inventory.note" /> : noteName,
              }}
              columnWidths={{
                'Staff only': '25%',
                'Note': '75%',
              }}
              formatter={
                {
                  'Staff only': x => (notesList === emptyList ? noValue : staffOnlyFormatter(x)),
                  'Note': x => get(x, ['note']) || noValue,
                }
              }
              containerRef={ref => { this.resultsList = ref; }}
              interactive={false}
            />
          </Row>
        );
      });
    };

    return (
      <IntlConsumer>
        {intl => (
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
              contentLabel={intl.formatMessage({ id: 'ui-inventory.viewHoldingsRecord' })}
            >
              <div data-test-holdings-view-page>
                <Pane
                  defaultWidth={this.props.paneWidth}
                  appIcon={<AppIcon app="inventory" iconKey="holdings" />}
                  paneTitle={
                    <span data-test-header-title>
                      <FormattedMessage
                        id="ui-inventory.holdingsTitle"
                        values={{
                          location: get(holdingsPermanentLocation, 'name', ''),
                          callNumber: callNumberLabel(holdingsRecord)
                        }}
                      />
                    </span>
                  }
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
                          <em>. </em>
                          <em>
                            {instance.publication[0].publisher}
                            {instance.publication[0].dateOfPublication ? `, ${instance.publication[0].dateOfPublication}` : ''}
                          </em>
                        </span>
                      }
                    </Col>
                  </Row>
                  <hr />
                  <AccordionStatus>
                    <Row>
                      <Col xs={10}>
                        {
                          holdingsRecord.discoverySuppress &&
                          <TextField fullWidth readOnly value={intl.formatMessage({ id: 'ui-inventory.holdingsRecord.suppressedFromDiscovery' })} error=" " />
                        }
                      </Col>
                      <Col data-test-expand-all xs={2}>
                        <ExpandAllButton />
                      </Col>
                    </Row>
                    <AccordionSet initialStatus={initialAccordionsState}>
                      <Accordion
                        id="acc01"
                        label={<FormattedMessage id="ui-inventory.administrativeData" />}
                      >
                        <this.cViewMetaData metadata={holdingsRecord.metadata} />
                        <Row>
                          <Col xs={12}>
                            {holdingsRecord.discoverySuppress && <WarningMessage id="ui-inventory.discoverySuppressed" />}
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col
                            smOffset={0}
                            sm={2}
                          >
                            <KeyValue label={<FormattedMessage id="ui-inventory.holdingsHrid" />}>
                              {checkIfElementIsEmpty(administrativeData.holdingsHrid)}
                              {Boolean(administrativeData.holdingsHrid) && <ClipCopy text={administrativeData.holdingsHrid} />}
                            </KeyValue>
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.holdingsSourceLabel" />}
                              value={checkIfElementIsEmpty(holdingsSourceName)}
                            />
                          </Col>
                          <Col>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.formerHoldingsId" />}
                              value={checkIfElementIsEmpty(formerHoldingsIdValue)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.holdingsType" />}
                              value={checkIfElementIsEmpty(administrativeData.holdingsType)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <MultiColumnList
                            id="list-statistical-codes"
                            contentData={statisticalCodeIdsContent}
                            visibleColumns={['Statistical code type', 'Statistical code']}
                            columnMapping={{
                              'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                              'Statistical code': intl.formatMessage({ id: 'ui-inventory.statisticalCode' }),
                            }}
                            columnWidths={{ 'Statistical code type': '16%' }}
                            formatter={{
                              'Statistical code type':
                                x => this.refLookup(referenceTables.statisticalCodeTypes,
                                  this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name || noValue,
                              'Statistical code':
                                x => this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name || noValue,
                            }}
                            ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
                            containerRef={ref => { this.resultsList = ref; }}
                          />
                        </Row>
                      </Accordion>

                      <Accordion
                        id="acc02"
                        label={<FormattedMessage id="ui-inventory.location" />}
                      >
                        <Row>
                          <Col smOffset={0} sm={4}>
                            <strong>
                              <FormattedMessage id="ui-inventory.holdingsLocation" />
                            </strong>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col
                            smOffset={0}
                            sm={4}
                          >
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.permanent" />}
                              value={checkIfElementIsEmpty(locationAccordion.permanent)}
                            />
                          </Col>
                          <Col sm={4}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.temporary" />}
                              value={checkIfElementIsEmpty(locationAccordion.temporary)}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                              value={checkIfElementIsEmpty(locationAccordion.shelvingOrder)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.shelvingTitle" />}
                              value={checkIfElementIsEmpty(locationAccordion.shelvingTitle)}
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
                              value={checkIfElementIsEmpty(locationAccordion.copyNumber)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.callNumberType" />}
                              value={checkIfElementIsEmpty(locationAccordion.callNumberType)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                              value={checkIfElementIsEmpty(locationAccordion.callNumberPrefix)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.callNumber" />}
                              value={checkIfElementIsEmpty(locationAccordion.callNumber)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                              value={checkIfElementIsEmpty(locationAccordion.callNumberSuffix)}
                            />
                          </Col>
                        </Row>
                      </Accordion>

                      <Accordion
                        id="acc03"
                        label={<FormattedMessage id="ui-inventory.holdingsDetails" />}
                      >
                        <KeyValue
                          label={<FormattedMessage id="ui-inventory.numberOfItems" />}
                          value={checkIfElementIsEmpty(holdingsDetails.numberOfItems)}
                        />
                        {holdingsDetailsTables(intl).map(item => (
                          <Row key={item.id}>
                            <MultiColumnList
                              id={item.id}
                              contentData={item.contentData}
                              visibleColumns={item.visibleColumns}
                              columnMapping={item.columnMapping}
                              columnWidths={item.columnWidths}
                              formatter={item.formatter}
                              ariaLabel={item.ariaLabel}
                              containerRef={ref => { this.resultsList = ref; }}
                            />
                          </Row>
                        ))}
                        <Row>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.illPolicy" />}
                              value={checkIfElementIsEmpty(holdingsDetails.illPolicy)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.digitizationPolicy" />}
                              value={checkIfElementIsEmpty(holdingsDetails.digitizationPolicy)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.retentionPolicy" />}
                              value={checkIfElementIsEmpty(holdingsDetails.retentionPolicy)}
                            />
                          </Col>
                        </Row>
                      </Accordion>

                      {tagsEnabled && (
                        <TagsAccordion
                          link={`holdings-storage/holdings/${holdingsRecord.id}`}
                          getEntity={this.getEntity}
                          getEntityTags={this.getEntityTags}
                          entityTagsPath="tags"
                        />
                      )}

                      <Accordion
                        id="acc04"
                        label={<FormattedMessage id="ui-inventory.holdingsNotes" />}
                      >
                        {layoutNotes(holdingsNotes)}
                      </Accordion>

                      <Accordion
                        id="acc05"
                        label={<FormattedMessage id="ui-inventory.electronicAccess" />}
                      >
                        <MultiColumnList
                          id="holding-list-electronic-access"
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
                            'URL relationship': '16%',
                            'URI': '16%',
                            'Link text': '16%',
                            'Materials specified': '16%',
                            'URL public note': '32%',
                          }}
                          formatter={{
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
                          }}
                          ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
                          containerRef={ref => { this.resultsList = ref; }}
                        />
                      </Accordion>

                      <Accordion
                        id="acc06"
                        label={<FormattedMessage id="ui-inventory.acquisition" />}
                      >
                        <Row>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.acquisitionMethod" />}
                              value={checkIfElementIsEmpty(acquisition.acquisitionMethod)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.acquisitionFormat" />}
                              value={checkIfElementIsEmpty(acquisition.acquisitionFormat)}
                            />
                          </Col>
                          <Col sm={2}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.receiptStatus" />}
                              value={checkIfElementIsEmpty(acquisition.receiptStatus)}
                            />
                          </Col>
                        </Row>
                      </Accordion>

                      <Accordion
                        id="acc07"
                        label={<FormattedMessage id="ui-inventory.receivingHistory" />}
                      >
                        <MultiColumnList
                          id="list-retrieving-history"
                          contentData={checkIfArrayIsEmpty(receivingHistory)}
                          visibleColumns={['Enumeration', 'Chronology']}
                          columnMapping={{
                            'Enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
                            'Chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
                          }}
                          columnWidths={{ 'Enumeration': '16%' }}
                          formatter={{
                            'Enumeration': x => x.enumeration || noValue,
                            'Chronology': x => x.chronology || noValue,
                          }}
                          ariaLabel={intl.formatMessage({ id: 'ui-inventory.receivingHistory' })}
                          containerRef={ref => { this.resultsList = ref; }}
                        />
                      </Accordion>
                    </AccordionSet>
                  </AccordionStatus>
                </Pane>
              </div>
            </Layer>
            <Layer
              isOpen={query.layer ? (query.layer === 'editHoldingsRecord') : false}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.editHoldingsRecordDialog' })}
            >
              <HoldingsForm
                initialValues={holdingsRecord}
                onSubmit={(record) => this.updateHoldingsRecord(record)}
                onCancel={this.onClickCloseEditHoldingsRecord}
                okapi={okapi}
                instance={instance}
                referenceTables={referenceTables}
                stripes={this.props.stripes}
                itemCount={itemCount}
              />
            </Layer>
            <Layer
              isOpen={query.layer ? (query.layer === 'copyHoldingsRecord') : false}
              contentLabel={intl.formatMessage({ id: 'ui-inventory.copyHoldingsRecordDialog' })}
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
        )}
      </IntlConsumer>
    );
  }
}

ViewHoldingsRecord.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    instances1: PropTypes.object,
    items: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.object,
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    tagSettings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    permanentLocation: PropTypes.object,
    temporaryLocation: PropTypes.object,
    permanentLocationQuery: PropTypes.object,
    temporaryLocationQuery: PropTypes.object,
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
