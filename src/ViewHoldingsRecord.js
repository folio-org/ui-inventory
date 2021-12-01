import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
  cloneDeep,
  omit,
  orderBy,
  last,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Link } from 'react-router-dom';
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
} from '@folio/stripes/core';

import {
  craftLayerUrl,
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  checkIfArrayIsEmpty,
  staffOnlyFormatter,
  getSortedNotes,
  handleKeyCommand,
  getDate,
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
import HoldingAquisitions from './Holding/ViewHolding/HoldingAquisitions';
import HoldingReceivingHistory from './Holding/ViewHolding/HoldingReceivingHistory';

import css from './View.css';

class ViewHoldingsRecord extends React.Component {
  static contextType = CalloutContext;

  static manifest = Object.freeze({
    query: {},
    permanentLocationQuery: {},
    temporaryLocationQuery: {},
    holdingsRecords: {
      type: 'okapi',
      path: 'holdings-storage/holdings/:{holdingsrecordid}',
      resourceShouldRefresh: false,
      accumulate: true,
      GET: {
        path: 'holdings-storage/holdings/:{holdingsrecordid}',
      },
      PUT: {
        path: 'inventory/holdings/:{holdingsrecordid}',
      },
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
  });

  constructor(props) {
    super(props);
    this.state = {
      marcRecord: null,
      confirmHoldingsRecordDeleteModal: false,
      noHoldingsRecordDeleteModal: false,
    };
    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
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

  componentDidMount() {
    this.props.mutator.holdingsRecords.GET();

    if (this.props.resources.instances1?.records[0]?.source) {
      if (this.isMARCSource() && !this.state.markRecord) {
        this.getMARCRecord();
      }
    }
  }

  componentDidUpdate(prevProps) {
    const wasHoldingsRecordsPending = prevProps.resources.holdingsRecords?.isPending;
    const isHoldingsRecordsPending = this.props.resources.holdingsRecords?.isPending;
    const hasHoldingsRecordsLoaded = this.props.resources.holdingsRecords?.hasLoaded;

    if (wasHoldingsRecordsPending !== isHoldingsRecordsPending && hasHoldingsRecordsLoaded) {
      if (this.isMARCSource() && !this.state.markRecord) {
        this.getMARCRecord();
      }
    }
  }

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

    // adding a local state variable to overcome a delay in `isPending`
    // is false between PUT to update and GET request to refresh a record
    this.setState({ isLoadingUpdatedHoldingsRecord: true });

    return this.props.mutator.holdingsRecords.PUT(holdings).then(() => {
      this.context.sendCallout({
        type: 'success',
        message: <FormattedMessage
          id="ui-inventory.holdingsRecord.successfullySaved"
          values={{ hrid: holdingsRecord.hrid }}
        />,
      });

      this.props.mutator.holdingsRecords.GET().then(() => {
        this.setState({ isLoadingUpdatedHoldingsRecord: false });
        this.onClickCloseEditHoldingsRecord();
      });
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
    const {
      onCloseViewHoldingsRecord,
      mutator,
    } = this.props;
    const { marcRecord } = this.state;

    onCloseViewHoldingsRecord();

    mutator.holdingsRecords.DELETE(holdingsRecord)
      .then(() => {
        const isSourceMARC = this.isMARCSource();

        if (isSourceMARC) {
          mutator.marcRecordId.replace(marcRecord.id);
          mutator.marcRecord.DELETE(marcRecord.id);
        }
      });
  }

  onCopy(record) {
    const {
      updateLocation,
      referenceTables,
    } = this.props;

    const FOLIOSourceId = referenceTables?.holdingsSourcesByName.FOLIO.id;

    this.setState((state) => {
      const newState = cloneDeep(state);

      newState.copiedRecord = omit(record, ['id', 'hrid', 'formerIds']);
      newState.copiedRecord.sourceId = FOLIOSourceId;

      return newState;
    });

    updateLocation({ layer: 'copyHoldingsRecord' });
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
      resources: {
        instances1,
      },
    } = this.props;

    const holdingsRecord = this.getMostRecentHolding();

    const searchParams = new URLSearchParams(location.search);
    searchParams.append('relatedRecordVersion', holdingsRecord._version);

    goTo(`/inventory/quick-marc/edit-holdings/${instances1.records[0].id}/${holdingsRecord.id}?${searchParams.toString()}`);
  }

  getPaneHeaderActionMenu = ({ onToggle }) => {
    const {
      resources,
      stripes,
    } = this.props;
    const { marcRecord } = this.state;
    const { instances1 } = resources;

    const canCreate = stripes.hasPerm('ui-inventory.holdings.create');
    const canEdit = stripes.hasPerm('ui-inventory.holdings.edit');
    const canDelete = stripes.hasPerm('ui-inventory.holdings.delete');

    const instance = instances1.records[0];
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
        {isSourceMARC && (
          <>
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
    const {
      holdingsRecords,
      instances1,
      permanentLocation,
      temporaryLocation,
    } = this.props.resources;

    if (this.state.isLoadingUpdatedHoldingsRecord) {
      return false;
    }

    if (!holdingsRecords || holdingsRecords.isPending || !holdingsRecords.records.length) {
      return true;
    }

    const holdingsRecord = this.getMostRecentHolding();

    if (!instances1 || !instances1.hasLoaded
      || (holdingsRecord.permanentLocationId && (!permanentLocation || !permanentLocation.hasLoaded))
      || (holdingsRecord.temporaryLocationId && (!temporaryLocation || !temporaryLocation.hasLoaded))) {
      return true;
    }

    return false;
  };

  getEntity = () => this.getMostRecentHolding();
  getEntityTags = () => this.getMostRecentHolding()?.tags?.tagList || [];

  render() {
    const {
      location,
      resources: {
        instances1,
        permanentLocation,
        temporaryLocation,
        items,
        tagSettings,
      },
      referenceTables,
      okapi,
      goTo,
      stripes,
    } = this.props;

    if (this.isAwaitingResource()) {
      return <FormattedMessage id="ui-inventory.holdingsRecord.awaitingResources" />;
    }

    const instance = instances1.records[0];
    const instanceSource = referenceTables?.holdingsSources?.find(source => source.name === instance.source);
    const holdingsRecord = this.getMostRecentHolding();
    const holdingsSource = referenceTables?.holdingsSources?.find(source => source.id === holdingsRecord.sourceId);
    const holdingsPermanentLocation = holdingsRecord.permanentLocationId ? permanentLocation.records[0] : null;
    const holdingsTemporaryLocation = holdingsRecord.temporaryLocationId ? temporaryLocation.records[0] : null;
    const itemCount = get(items, 'records.length', 0);
    const query = location.search ? queryString.parse(location.search) : {};
    const holdingsSourceName = holdingsSource?.name || instanceSource.name;
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

    const initialAccordionsState = {
      acc01: !areAllFieldsEmpty(Object.values(administrativeData)),
      acc02: !areAllFieldsEmpty(Object.values(locationAccordion)),
      acc03: !areAllFieldsEmpty(Object.values(holdingsDetails)),
      acc04: !areAllFieldsEmpty([holdingsNotes]),
      acc05: !areAllFieldsEmpty([electronicAccess]),
      acc06: false,
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
        name: 'edit',
        handler: handleKeyCommand(() => {
          if (stripes.hasPerm('ui-inventory.holdings.edit')) this.onClickEditHoldingsRecord();
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
            <Layer
              isOpen
              contentLabel={intl.formatMessage({ id: 'ui-inventory.viewHoldingsRecord' })}
            >
              <div data-test-holdings-view-page>
                <HasCommand
                  commands={shortcuts}
                  isWithinScope={checkScope}
                  scope={document.body}
                >
                  <Pane
                    defaultWidth={this.props.paneWidth}
                    appIcon={<AppIcon app="inventory" iconKey="holdings" />}
                    paneTitle={intl.formatMessage({
                      id: 'ui-inventory.holdingsPaneTitle',
                    }, {
                      location: referenceTables?.locationsById[holdingsRecord?.effectiveLocationId]?.name,
                      callNumber: holdingsRecord?.callNumber,
                    })}
                    paneSub={intl.formatMessage({
                      id: 'ui-inventory.instanceRecordSubtitle',
                    }, {
                      hrid: holdingsRecord?.hrid,
                      updatedDate: getDate(holdingsRecord?.metadata?.updatedDate),
                    })}
                    dismissible
                    onClose={this.props.onCloseViewHoldingsRecord}
                    actionMenu={this.getPaneHeaderActionMenu}
                  >
                    <Row center="xs">
                      <Col sm={6}>
                        <FormattedMessage id="ui-inventory.instance" />
                        <Link to={`/inventory/view/${instance.id}`}>
                          {instance.title}
                        </Link>
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

                        {
                          this.props.stripes.hasInterface('orders.holding-summary') && (
                            <Accordion
                              id="acc06"
                              label={<FormattedMessage id="ui-inventory.acquisition" />}
                            >
                              <HoldingAquisitions holding={holdingsRecord} />
                            </Accordion>
                          )
                        }

                        <HoldingReceivingHistory holding={holdingsRecord} />
                      </AccordionSet>
                    </AccordionStatus>
                  </Pane>
                </HasCommand>
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
                goTo={goTo}
                isMARCRecord={this.isMARCSource()}
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
                goTo={goTo}
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
    permanentLocationQuery: PropTypes.object.isRequired,
    temporaryLocationQuery: PropTypes.object.isRequired,
  }),
  onCloseViewHoldingsRecord: PropTypes.func.isRequired,
  updateLocation: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default withLocation(ViewHoldingsRecord);
