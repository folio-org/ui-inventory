import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
  orderBy,
  last,
  flowRight,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
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
  LoadingView,
  MessageBanner,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  ClipCopy,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  IntlConsumer,
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import {
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  checkIfArrayIsEmpty,
  staffOnlyFormatter,
  getSortedNotes,
  handleKeyCommand,
  getDate,
} from './utils';
import withLocation from './withLocation';
import {
  wrappingCell,
  emptyList,
  noValue,
  holdingsStatementTypes,
} from './constants';
import {
  WarningMessage,
  AdministrativeNoteList,
} from './components';
import HoldingAquisitions from './Holding/ViewHolding/HoldingAquisitions';
import HoldingReceivingHistory from './Holding/ViewHolding/HoldingReceivingHistory';
import HoldingBoundWith from './Holding/ViewHolding/HoldingBoundWith';

import css from './View.css';

class ViewHoldingsRecord extends React.Component {
  static contextType = CalloutContext;

  static manifest = Object.freeze({
    query: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      resourceShouldRefresh: false,
      accumulate: true,
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
      accumulate: true,
    },
    tagSettings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==TAGS and configName==tags_enabled)',
    },
    marcRecordId: {},
    marcRecord: {
      type: 'okapi',
      path: 'source-storage/records/:{holdingsrecordid}/formatted?idType=HOLDINGS',
      accumulate: true,
      throwErrors: false,
      DELETE: {
        path: 'source-storage/records/%{marcRecordId}',
      },
    },
    boundWithParts: {
      type: 'okapi',
      records: 'boundWithParts',
      path: 'inventory-storage/bound-with-parts',
      params: {
        query: '(holdingsRecordId==:{holdingsrecordid})',
        limit: '5000',
      },
      resourceShouldRefresh: true,
    },
  });

  constructor(props) {
    super(props);
    this.state = {
      marcRecord: null,
      instance: null,
      confirmHoldingsRecordDeleteModal: false,
      noHoldingsRecordDeleteModal: false,
    };
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
  }

  componentDidMount() {
    const holdingsRecordPromise = this.props.mutator.holdingsRecords.GET();
    const instances1Promise = this.props.mutator.instances1.GET();

    Promise.all([holdingsRecordPromise, instances1Promise])
      .then(([, instances1Response]) => {
        this.setInstance(instances1Response);

        if (this.state.instance?.source) {
          if (this.isMARCSource() && !this.state.marcRecord) {
            this.getMARCRecord();
          }
        }
      });
  }

  componentDidUpdate(prevProps) {
    const wasHoldingsRecordsPending = prevProps.resources.holdingsRecords?.isPending;
    const isHoldingsRecordsPending = this.props.resources.holdingsRecords?.isPending;
    const hasHoldingsRecordsLoaded = this.props.resources.holdingsRecords?.hasLoaded;

    if (wasHoldingsRecordsPending !== isHoldingsRecordsPending && hasHoldingsRecordsLoaded) {
      if (this.isMARCSource() && !this.state.marcRecord) {
        this.getMARCRecord();
      }
    }
  }

  setInstance = (instance) => {
    this.setState({ instance });
  };

  getMostRecentHolding = () => {
    return last(this.props.resources.holdingsRecords.records);
  }

  isMARCSource = () => {
    const {
      referenceTables,
    } = this.props;

    const holdingsRecord = this.getMostRecentHolding();
    const holdingsSource = referenceTables?.holdingsSources?.find(source => source.id === holdingsRecord?.sourceId);

    return holdingsSource?.name === 'MARC';
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

  onClose = (e) => {
    if (e) e.preventDefault();

    const {
      history,
      location: { search, state: locationState },
      id,
    } = this.props;

    history.push({
      pathname: locationState?.backPathname ?? `/inventory/view/${id}`,
      search,
    });
  }

  // Edit Holdings records handlers
  onEditHolding = (e) => {
    if (e) e.preventDefault();

    const {
      history,
      location,
      id,
      holdingsrecordid,
    } = this.props;

    history.push({
      pathname: `/inventory/edit/${id}/${holdingsrecordid}`,
      search: location.search,
      state: { backPathname: location.pathname },
    });
  }

  onCopyHolding = (e) => {
    if (e) e.preventDefault();

    const {
      history,
      location,
      id,
      holdingsrecordid,
    } = this.props;

    history.push({
      pathname: `/inventory/copy/${id}/${holdingsrecordid}`,
      search: location.search,
      state: { backPathname: location.pathname },
    });
  }

  deleteHoldingsRecord = (holdingsRecord) => {
    const {
      mutator,
    } = this.props;
    const { marcRecord } = this.state;

    this.onClose();

    mutator.holdingsRecords.DELETE(holdingsRecord)
      .then(() => {
        const isSourceMARC = this.isMARCSource();

        if (isSourceMARC) {
          mutator.marcRecordId.replace(marcRecord.id);
          mutator.marcRecord.DELETE(marcRecord.id);
        }
      });
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

  handleViewSource = (e, instance) => {
    if (e) {
      e.preventDefault();
    }

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

  handleEditInQuickMarc = (e) => {
    if (e) {
      e.preventDefault();
    }

    const {
      location,
      goTo,
    } = this.props;
    const { instance } = this.state;

    const holdingsRecord = this.getMostRecentHolding();

    const searchParams = new URLSearchParams(location.search);

    searchParams.delete('relatedRecordVersion');
    searchParams.append('relatedRecordVersion', holdingsRecord._version);

    goTo(`/inventory/quick-marc/edit-holdings/${instance?.id}/${holdingsRecord.id}?${searchParams.toString()}`);
  }

  getPaneHeaderActionMenu = ({ onToggle }) => {
    const { stripes } = this.props;
    const {
      instance,
      marcRecord,
    } = this.state;

    const canCreate = stripes.hasPerm('ui-inventory.holdings.create');
    const canEdit = stripes.hasPerm('ui-inventory.holdings.edit');
    const canDelete = stripes.hasPerm('ui-inventory.holdings.delete');
    const canViewMARC = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.view');
    const canEditMARC = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.all');

    const isSourceMARC = this.isMARCSource();

    if (!canCreate && !canEdit && !canDelete) {
      return null;
    }

    const firstRecordOfHoldings = this.getMostRecentHolding();

    return (
      <>
        {
          canEdit &&
          <Button
            id="edit-holdings"
            onClick={this.onEditHolding}
            buttonStyle="dropdownItem"
            data-testid="edit-holding-btn"
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
            onClick={this.onCopyHolding}
            buttonStyle="dropdownItem"
            data-testid="duplicate-holding-btn"
          >
            <Icon icon="duplicate">
              <FormattedMessage id="ui-inventory.duplicateHoldings" />
            </Icon>
          </Button>
        }
        {isSourceMARC && (
          <>
            {canViewMARC && (
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
            )}
            {canEditMARC && (
              <Button
                id="clickable-edit-marc-holdings"
                buttonStyle="dropdownItem"
                disabled={!marcRecord}
                onClick={(e) => {
                  onToggle();
                  this.handleEditInQuickMarc(e);
                }}
              >
                <Icon icon="edit">
                  <FormattedMessage id="ui-inventory.editMARCHoldings" />
                </Icon>
              </Button>
            )}
          </>
        )}
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
    const { referenceTables } = this.props;
    const {
      holdingsRecords,
      instances1,
    } = this.props.resources;
    const { instance } = this.state;

    if (this.state.isLoadingUpdatedHoldingsRecord) {
      return false;
    }

    if (!holdingsRecords || holdingsRecords.isPending || !holdingsRecords.records.length) {
      return true;
    }

    if (!instances1 || !instances1.hasLoaded) {
      return true;
    }

    if (!instance) {
      return true;
    }

    return isEmpty(referenceTables);
  };

  render() {
    const {
      resources: {
        items,
        tagSettings,
        boundWithParts,
      },
      referenceTables,
      goTo,
      stripes,
    } = this.props;
    const { instance } = this.state;

    if (this.isAwaitingResource()) return <LoadingView />;

    const holdingsRecord = this.getMostRecentHolding();
    const holdingsSource = referenceTables?.holdingsSources?.find(source => source.id === holdingsRecord.sourceId);
    const holdingsPermanentLocation = referenceTables?.locationsById[holdingsRecord?.permanentLocationId];
    const holdingsPermanentLocationName = get(holdingsPermanentLocation, ['name'], '-');
    const holdingsTemporaryLocation = referenceTables?.locationsById[holdingsRecord?.temporaryLocationId];
    const holdingsEffectiveLocation = referenceTables?.locationsById[holdingsRecord?.effectiveLocationId];
    const itemCount = get(items, 'records.length', 0);
    const holdingsSourceName = holdingsSource?.name;
    const tagsEnabled = !tagSettings?.records?.length || tagSettings?.records?.[0]?.value === 'true';

    const confirmHoldingsRecordDeleteModalMessage = (
      <FormattedMessage
        id="ui-inventory.confirmHoldingsRecordDeleteModal.message"
        values={{
          hrid: holdingsRecord.hrid,
          location: holdingsPermanentLocationName
        }}
      />
    );

    const noHoldingsRecordDeleteModalMessageId = itemCount > 1
      ? 'ui-inventory.itemsOnHoldingsRecordDeleteModal.message'
      : 'ui-inventory.itemOnHoldingsRecordDeleteModal.message';

    const noHoldingsRecordDeleteModalMessage = (
      <FormattedMessage
        id={noHoldingsRecordDeleteModalMessageId}
        values={{
          hrid: holdingsRecord.hrid,
          location: holdingsPermanentLocationName,
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
      permanent: holdingsPermanentLocation,
      temporary: holdingsTemporaryLocation,
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

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(Object.values(administrativeData)),
      acc02: !areAllFieldsEmpty(Object.values(locationAccordion)),
      acc03: !areAllFieldsEmpty(Object.values(holdingsDetails)),
      acc04: !areAllFieldsEmpty([holdingsNotes]),
      acc05: !areAllFieldsEmpty([electronicAccess]),
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

    const shortcuts = [
      {
        name: 'duplicateRecord',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.holdings.create')) this.onCopyHolding();
        }),
      },
      {
        name: 'edit',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.holdings.edit')) this.onEditHolding();
        }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'search',
        handler: handleKeyCommand(() => goTo('/inventory')),
      },
    ];

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
            <div data-test-holdings-view-page>
              <HasCommand
                commands={shortcuts}
                isWithinScope={checkScope}
                scope={document.body}
              >
                <Pane
                  id="ui-inventory.holdingsRecordView"
                  defaultWidth={this.props.paneWidth}
                  appIcon={<AppIcon app="inventory" iconKey="holdings" />}
                  paneTitle={intl.formatMessage({
                    id: 'ui-inventory.holdingsPaneTitle',
                  }, {
                    location:
                      holdingsEffectiveLocation?.isActive ?
                        holdingsEffectiveLocation?.name :
                        intl.formatMessage(
                          { id: 'ui-inventory.inactive.paneTitle' },
                          { location: holdingsEffectiveLocation?.name }
                        ),
                    callNumber: holdingsRecord?.callNumber,
                  })}
                  paneSub={intl.formatMessage({
                    id: 'ui-inventory.instanceRecordSubtitle',
                  }, {
                    hrid: holdingsRecord?.hrid,
                    updatedDate: getDate(holdingsRecord?.metadata?.updatedDate),
                  })}
                  dismissible
                  onClose={this.onClose}
                  actionMenu={this.getPaneHeaderActionMenu}
                >
                  <Row center="xs">
                    <Col sm={6}>
                      <FormattedMessage id="ui-inventory.instance" />
                      <Link to={`/inventory/view/${instance?.id}`}>
                        {instance?.title}
                      </Link>
                      {(instance?.publication && instance?.publication.length > 0) &&
                      <span>
                        <em>. </em>
                        <em>
                          {instance?.publication[0].publisher}
                          {instance?.publication[0].dateOfPublication ? `, ${instance?.publication[0].dateOfPublication}` : ''}
                        </em>
                      </span>
                        }
                    </Col>
                  </Row>
                  <hr />
                  <AccordionStatus ref={this.accordionStatusRef}>
                    <Row className={css.rowMarginBottom}>
                      <Col xs={11}>
                        <Row center="xs" middle="xs">
                          <Col>
                            <MessageBanner show={Boolean(holdingsRecord.discoverySuppress)} type="warning">
                              <FormattedMessage id="ui-inventory.warning.holdingsRecord.suppressedFromDiscovery" />
                            </MessageBanner>
                          </Col>
                        </Row>
                      </Col>
                      <Col data-test-expand-all xs={1}>
                        <Row end="xs">
                          <Col>
                            <ExpandAllButton />
                          </Col>
                        </Row>
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
                          <Col xs={12}>
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
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            <AdministrativeNoteList administrativeNotes={holdingsRecord.administrativeNotes} />
                          </Col>
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
                              value={checkIfElementIsEmpty(locationAccordion.permanent?.name)}
                              subValue={(!locationAccordion.permanent?.isActive) &&
                                <FormattedMessage id="ui-inventory.inactive" />
                              }
                            />
                          </Col>
                          <Col sm={4}>
                            <KeyValue
                              label={<FormattedMessage id="ui-inventory.temporary" />}
                              value={checkIfElementIsEmpty(locationAccordion.temporary?.name)}
                              subValue={(locationAccordion.temporary &&
                                !locationAccordion.temporary?.isActive) &&
                                <FormattedMessage id="ui-inventory.inactive" />
                              }
                              data-test-id="temporary-location"
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

                      <HoldingAquisitions
                        holding={holdingsRecord}
                        withSummary={this.props.stripes.hasInterface('orders.holding-summary')}
                      />

                      <HoldingReceivingHistory holding={holdingsRecord} />

                      <HoldingBoundWith boundWithParts={boundWithParts.records} />

                    </AccordionSet>
                  </AccordionStatus>
                </Pane>
              </HasCommand>
            </div>
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
    hasInterface: PropTypes.func.isRequired,
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
    boundWithParts: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  location: PropTypes.object,
  history: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  holdingsrecordid: PropTypes.string.isRequired,
  paneWidth: PropTypes.string,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    instances1: PropTypes.shape({
      GET: PropTypes.func.isRequired,
    }),
    holdingsRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    marcRecordId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    marcRecord: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }),
    query: PropTypes.object.isRequired,
  }),
  goTo: PropTypes.func.isRequired,
};

export default flowRight(
  withLocation,
  stripesConnect,
)(ViewHoldingsRecord);
