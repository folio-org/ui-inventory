import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
  orderBy,
  last,
  flowRight,
  first,
  uniq,
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
  Button,
  Modal,
  ModalFooter,
  ConfirmationModal,
  LoadingView,
  MessageBanner,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
  Callout,
  PaneMenu,
  Paneset,
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
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import {
  FindLocation,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

import {
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  checkIfArrayIsEmpty,
  staffOnlyFormatter,
  getSortedNotes,
  handleKeyCommand,
  getDate,
  switchAffiliation,
  isInstanceShadowCopy,
  omitCurrentAndCentralTenants,
} from './utils';
import { withLocation } from './hocs';
import {
  wrappingCell,
  emptyList,
  noValue,
  holdingsStatementTypes,
} from './constants';
import {
  WarningMessage,
  AdministrativeNoteList,
  ActionItem,
} from './components';
import HoldingAcquisitions from './Holding/ViewHolding/HoldingAcquisitions';
import HoldingReceivingHistory from './Holding/ViewHolding/HoldingReceivingHistory';
import HoldingBoundWith from './Holding/ViewHolding/HoldingBoundWith';
import { HoldingVersionHistory } from './Holding/HoldingVersionHistory';

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
      tenant: '!{tenantTo}',
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
      tenant: '!{tenantTo}',
    },
    orderLine: {
      accumulate: true,
      path: 'orders/order-lines/:{poLineId}',
      throwErrors: false,
      type: 'okapi',
      fetch: false,
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
      isLocationLookupOpen: false,
      isUpdateOwnershipModalOpen: false,
      updateOwnershipData: {},
      tenants: [],
      isVersionHistoryOpen: false,
    };
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.accordionStatusRef = createRef();
    this.calloutRef = createRef();
  }

  componentDidMount() {
    const {
      stripes,
      mutator,
    } = this.props;

    mutator.holdingsRecords.reset();
    const holdingsRecordPromise = mutator.holdingsRecords.GET();
    mutator.instances1.reset();
    const instances1Promise = mutator.instances1.GET();

    Promise.all([holdingsRecordPromise, instances1Promise])
      .then(([, instances1Response]) => {
        this.setInstance(instances1Response);
        if (!instances1Response.source) {
          return;
        }

        if (!this.isMARCSource() || this.state.marcRecord) {
          return;
        }

        this.getMARCRecord();
      });

    if (checkIfUserInMemberTenant(stripes)) {
      this.setState({ tenants: omitCurrentAndCentralTenants(stripes) });
    }
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

  goToInstanceView = () => {
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

  onClose = async (e) => {
    if (e) e.preventDefault();

    const {
      stripes,
      location,
    } = this.props;
    const tenantFrom = location?.state?.initialTenantId || stripes.okapi.tenant;

    await switchAffiliation(stripes, tenantFrom, this.goToInstanceView);
  }

  // Edit Holdings records handlers
  onEditHolding = (e) => {
    if (e) e.preventDefault();

    const {
      history,
      location,
      id,
      holdingsrecordid,
      initialTenantId,
    } = this.props;

    history.push({
      pathname: `/inventory/edit/${id}/${holdingsrecordid}`,
      search: location.search,
      state: {
        backPathname: location.pathname,
        initialTenantId,
      },
    });
  }

  onCopyHolding = (e) => {
    if (e) e.preventDefault();

    const {
      history,
      location,
      id,
      holdingsrecordid,
      stripes,
      initialTenantId,
    } = this.props;

    const tenantFrom = stripes.okapi.tenant;

    history.push({
      pathname: `/inventory/copy/${id}/${holdingsrecordid}`,
      search: location.search,
      state: {
        backPathname: location.pathname,
        tenantFrom,
        initialTenantId,
      },
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
          mutator.marcRecordId.replace(marcRecord?.id);
          mutator.marcRecord.DELETE(marcRecord?.id);
        }
      });
  }

  hideConfirmHoldingsRecordDeleteModal = () => {
    this.setState({ confirmHoldingsRecordDeleteModal: false });
  }

  hideNoHoldingsRecordDeleteModal = () => {
    this.setState({ noHoldingsRecordDeleteModal: false });
  }

  handleUpdateOwnership = () => {
    const { mutator: { orderLine }, resources } = this.props;
    const poLineIds = uniq(resources.items?.records?.map(({ purchaseOrderLineIdentifier }) => purchaseOrderLineIdentifier));

    if (poLineIds?.length) {
      const poLineRequest = poLineIds.map(poLineId => orderLine.GET({ path: `orders/order-lines/${poLineId}` }));

      Promise.all(poLineRequest)
        .then(() => {
          this.openLinkedOrderLineModal();
        }).catch(() => {
          this.openLocationLookup();
        });
    } else {
      this.openLocationLookup();
    }
  }

  openLocationLookup = () => {
    this.setState({ isLocationLookupOpen: true });
  }

  hideLocationLookup = () => {
    this.setState({ isLocationLookupOpen: false });
  }

  openUpdateOwnershipModal = () => {
    this.setState({ isUpdateOwnershipModalOpen: true });
  }

  hideUpdateOwnershipModal = () => {
    this.setState({ isUpdateOwnershipModalOpen: false });
  }

  hideLinkedOrderLineModal = () => {
    this.setState({ hasLinkedLocalOrderLineModal: false });
  }

  openLinkedOrderLineModal = () => {
    this.setState({ hasLinkedLocalOrderLineModal: true });
  }

  openVersionHistory = () => {
    this.setState({ isVersionHistoryOpen: true });
  }

  callUpdateOwnership = () => {
    const {
      stripes: { okapi },
      onUpdateOwnership,
    } = this.props;
    const holdingsRecord = this.getMostRecentHolding();

    onUpdateOwnership(
      {
        toInstanceId: holdingsRecord.instanceId,
        holdingsRecordIds: [holdingsRecord.id],
        targetTenantId: this.state.updateOwnershipData.targetTenant.id,
        targetLocationId: this.state.updateOwnershipData.targetLocationId,
      },
      okapi,
    ).then(() => {
      this.hideUpdateOwnershipModal();

      const message = (
        <FormattedMessage
          id="ui-inventory.updateOwnership.message.success"
          values={{
            holdingsHrid: holdingsRecord.hrid,
            targetTenant: this.state.updateOwnershipData.targetTenant.name,
          }}
        />
      );
      this.context.sendCallout({
        type: 'success',
        message,
      });

      this.goToInstanceView();
    }).catch((error) => {
      this.hideUpdateOwnershipModal();

      this.calloutRef.current.sendCallout({
        type: 'error',
        message: error?.message || <FormattedMessage id="ui-data-import.communicationProblem" />,
      });
    });
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
    const {
      stripes,
      isInstanceShared,
    } = this.props;
    const {
      instance,
      marcRecord,
    } = this.state;

    const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
    const isSharedInstance = isInstanceShared || isInstanceShadowCopy(instance.source);

    if (isUserInCentralTenant) return null;

    const canCreate = stripes.hasPerm('ui-inventory.holdings.create');
    const canEdit = stripes.hasPerm('ui-inventory.holdings.edit');
    const canDelete = stripes.hasPerm('ui-inventory.holdings.delete');
    const canViewMARC = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.view');
    const canEditMARC = stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.all');
    const hasUpdateOwnershipPermission = stripes.hasPerm('consortia.inventory.update-ownership.item.post');
    const canUpdateOwnership = hasUpdateOwnershipPermission && isSharedInstance && !isEmpty(this.state.tenants);

    const isSourceMARC = this.isMARCSource();

    const hasFolioPermissions = canCreate || canEdit || canDelete;
    const hasMARCPermissions = canViewMARC || canEditMARC;

    if ((isSourceMARC && (!hasMARCPermissions && !hasFolioPermissions)) || (!isSourceMARC && !hasFolioPermissions)) {
      return null;
    }

    const firstRecordOfHoldings = this.getMostRecentHolding();

    return (
      <>
        {canEdit && (
          <ActionItem
            id="edit-holdings"
            onClickHandler={this.onEditHolding}
            icon="edit"
            messageId="ui-inventory.editHoldings"
          />
        )}
        {canCreate && (
          <ActionItem
            id="copy-holdings"
            onClickHandler={this.onCopyHolding}
            icon="duplicate"
            messageId="ui-inventory.duplicateHoldings"
          />
        )}
        {canUpdateOwnership && (
          <ActionItem
            id="update-ownership"
            onClickHandler={this.handleUpdateOwnership}
            icon="profile"
            messageId="ui-inventory.updateOwnership"
          />
        )}
        {isSourceMARC && (
          <>
            {canViewMARC && (
              <ActionItem
                id="clickable-view-source"
                onClickHandler={(e) => {
                  onToggle();
                  this.handleViewSource(e, instance);
                }}
                icon="document"
                messageId="ui-inventory.viewSource"
                disabled={!marcRecord}
              />
            )}
            {canEditMARC && (
              <ActionItem
                id="clickable-edit-marc-holdings"
                onClickHandler={(e) => {
                  onToggle();
                  this.handleEditInQuickMarc(e);
                }}
                icon="edit"
                messageId="ui-inventory.editMARCHoldings"
                disabled={!marcRecord}
              />
            )}
          </>
        )}
        {canDelete && (
          <ActionItem
            id="clickable-delete-holdingsrecord"
            onClickHandler={() => {
              onToggle();
              this.setState(this.canDeleteHoldingsRecord(firstRecordOfHoldings) ?
                { confirmHoldingsRecordDeleteModal: true } : { noHoldingsRecordDeleteModal: true });
            }}
            icon="trash"
            messageId="ui-inventory.deleteHoldingsRecord"
          />
        )}
      </>
    );
  };

  onLocationSelect = ([location]) => {
    const {
      stripes,
      referenceTables,
    } = this.props;

    const currentTenantId = stripes.okapi.tenant;
    const targetTenantId = location.tenantId;

    const currentTenant = stripes.user.user.tenants.find(tenant => tenant.id === currentTenantId);
    const targetTenant = stripes.user.user.tenants.find(tenant => tenant.id === targetTenantId);

    const holdingsRecord = this.getMostRecentHolding();
    const permanentLocationName = get(referenceTables?.locationsById[holdingsRecord?.permanentLocationId], ['name'], '-');

    this.setState({
      updateOwnershipData: {
        currentTenant,
        targetTenant,
        currentLocation: permanentLocationName,
        targetLocationId: location.id,
      },
    });

    this.openUpdateOwnershipModal();
  }

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
      isVersionHistoryEnabled,
    } = this.props;
    const {
      instance,
      isVersionHistoryOpen,
    } = this.state;

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
      effective: holdingsEffectiveLocation,
      shelvingOrder: get(holdingsRecord, ['shelvingOrder'], '-'),
      shelvingTitle: get(holdingsRecord, ['shelvingTitle'], '-'),
      copyNumber: get(holdingsRecord, ['copyNumber'], '-'),
      callNumberType: this.refLookup(referenceTables.callNumberTypes, get(holdingsRecord, ['callNumberTypeId'])).name || '-',
      callNumberPrefix: get(holdingsRecord, ['callNumberPrefix'], '-'),
      callNumber: get(holdingsRecord, ['callNumber'], '-'),
      callNumberSuffix: get(holdingsRecord, ['callNumberSuffix'], '-'),
      additionalCallNumbers: get(holdingsRecord, ['additionalCallNumbers'], []),
    };

    const effectiveLocationDisplay = (
      <KeyValue
        label={<FormattedMessage id="ui-inventory.effectiveLocationHoldings" />}
        value={checkIfElementIsEmpty(locationAccordion.effective?.name)}
        subValue={(!locationAccordion.effective?.isActive) &&
          <FormattedMessage id="ui-inventory.inactive" />
        }
      />
    );

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
        name: 'editMARC',
        handler: handleKeyCommand(() => {
          if (!this.isMARCSource()) {
            return;
          }

          if (!stripes.hasPerm('ui-quick-marc.quick-marc-holdings-editor.all')) {
            this.calloutRef.current.sendCallout({
              type: 'error',
              message: <FormattedMessage id="ui-inventory.shortcut.editMARC.noPermission" />,
            });
            return;
          }

          this.handleEditInQuickMarc();
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
            <Callout ref={this.calloutRef} />
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
              id="linked-local-order-line-confirmation-modal"
              open={this.state.hasLinkedLocalOrderLineModal}
              label={<FormattedMessage id="ui-inventory.hasLinkedLocalOrderLine.modal.heading" />}
              footer={(
                <ModalFooter>
                  <Button
                    buttonStyle="primary"
                    onClick={this.hideLinkedOrderLineModal}
                    marginBottom0
                  >
                    <FormattedMessage id="stripes-core.button.continue" />
                  </Button>
                </ModalFooter>
              )}
            >
              <FormattedMessage id="ui-inventory.hasLinkedLocalOrderLine.modal.message" />
            </Modal>
            <ConfirmationModal
              id="update-ownership-modal"
              open={this.state.isUpdateOwnershipModalOpen}
              heading={<FormattedMessage id="ui-inventory.updateOwnership.holdings.modal.heading" />}
              message={
                <FormattedMessage
                  id="ui-inventory.updateOwnership.holdings.modal.message"
                  values={{
                    currentTenant: this.state.updateOwnershipData.currentTenant?.name,
                    targetTenant: this.state.updateOwnershipData.targetTenant?.name,
                    holdingsHrid: holdingsRecord.hrid,
                  }}
                />
              }
              onConfirm={this.callUpdateOwnership}
              onCancel={this.hideUpdateOwnershipModal}
              confirmLabel={<FormattedMessage id="ui-inventory.confirm" />}
            />
            <Modal
              data-test-no-delete-holdingsrecord-modal
              label={<FormattedMessage id="ui-inventory.confirmHoldingsRecordDeleteModal.heading" />}
              open={this.state.noHoldingsRecordDeleteModal}
              footer={noHoldingsRecordDeleteFooter}
            >
              {noHoldingsRecordDeleteModalMessage}
            </Modal>
            {this.state.isLocationLookupOpen && (
              <FindLocation
                id="location-lookup"
                crossTenant
                triggerless
                disabled={false}
                onClose={this.hideLocationLookup}
                onRecordsSelect={this.onLocationSelect}
                tenantId={first(this.state.tenants).id}
                tenantsList={this.state.tenants}
              />
            )}
            <div data-test-holdings-view-page>
              <HasCommand
                commands={shortcuts}
                isWithinScope={checkScope}
                scope={document.body}
              >
                <Paneset isRoot>
                  <Pane
                    id="view-holdings-record-pane"
                    defaultWidth="fill"
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
                    actionMenu={(params) => !isVersionHistoryOpen && this.getPaneHeaderActionMenu(params)}
                    lastMenu={(
                      <PaneMenu>
                        {isVersionHistoryEnabled && (
                          <VersionHistoryButton
                            disabled={isVersionHistoryOpen}
                            onClick={this.openVersionHistory}
                          />
                        )}
                      </PaneMenu>
                    )}
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
                    {
                    itemCount === 0 &&
                    <>
                      <Row>
                        <Col sm={12}>
                          <AppIcon
                            app="inventory"
                            iconKey="holdings"
                            size="small"
                          />
                          {' '}
                          <FormattedMessage id="ui-inventory.holdings" />
                        </Col>
                      </Row>
                      <br />
                    </>
                  }
                    <AccordionStatus ref={this.accordionStatusRef}>
                      <Row className={css.rowMarginBottom}>
                        <Col xs={2}>
                          {
                          itemCount === 0 && effectiveLocationDisplay
                        }
                        </Col>
                        <Col xs={8}>
                          <Row center="xs" middle="xs">
                            <Col>
                              <MessageBanner show={Boolean(holdingsRecord.discoverySuppress)} type="warning">
                                <FormattedMessage id="ui-inventory.warning.holdingsRecord.suppressedFromDiscovery" />
                              </MessageBanner>
                            </Col>
                          </Row>
                        </Col>
                        <Col data-test-expand-all xs={2}>
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
                                visibleColumns={['Statistical code type', 'Statistical code name']}
                                columnMapping={{
                                  'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                                  'Statistical code name': intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
                                }}
                                columnWidths={{ 'Statistical code type': '16%' }}
                                formatter={{
                                  'Statistical code type':
                                    x => this.refLookup(referenceTables.statisticalCodeTypes,
                                      this.refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name || noValue,
                                  'Statistical code name':
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
                          {
                          itemCount === 0 &&
                          <Row>
                            <Col sm={4}>
                              {effectiveLocationDisplay}
                            </Col>
                          </Row>
                        }
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
                              <h3><FormattedMessage id="ui-inventory.primaryHoldingsCallNumber" /></h3>
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
                          <Row>
                            {locationAccordion.additionalCallNumbers.length > 0 ? (
                              <Col xs={12}>
                                <h3><FormattedMessage id="ui-inventory.additionalHoldingsCallNumbers" /></h3>
                                <div>
                                  {locationAccordion.additionalCallNumbers.map((additionalCallNumber) => {
                                    const callNumberTypeName = this.refLookup(referenceTables.callNumberTypes, additionalCallNumber.typeId)?.name;
                                    return (
                                      <div
                                        key={additionalCallNumber.id}
                                        style={{ marginBottom: '10px' }}
                                      >
                                        <Row>
                                          <Col xs={3}>
                                            <KeyValue
                                              label={<FormattedMessage
                                                id="ui-inventory.callNumberType"
                                              />}
                                              value={checkIfElementIsEmpty(callNumberTypeName)}
                                            />
                                          </Col>
                                          <Col xs={3}>
                                            <KeyValue
                                              label={<FormattedMessage
                                                id="ui-inventory.callNumberPrefix"
                                              />}
                                              value={checkIfElementIsEmpty(additionalCallNumber.prefix)}
                                            />
                                          </Col>
                                          <Col xs={3}>
                                            <KeyValue
                                              label={<FormattedMessage
                                                id="ui-inventory.callNumber"
                                              />}
                                              value={checkIfElementIsEmpty(additionalCallNumber.callNumber)}
                                            />
                                          </Col>
                                          <Col xs={3}>
                                            <KeyValue
                                              label={<FormattedMessage
                                                id="ui-inventory.callNumberSuffix"
                                              />}
                                              value={checkIfElementIsEmpty(additionalCallNumber.suffix)}
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    );
                                  })}
                                </div>
                              </Col>
                            ) : ''}
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
                          hasOptimisticLocking
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
                              'URI': x => {
                                const uri = x?.uri;

                                return uri
                                  ? (
                                    <a
                                      href={uri}
                                      rel="noreferrer noopener"
                                      target="_blank"
                                      style={wrappingCell}
                                    >
                                      {uri}
                                    </a>
                                  )
                                  : noValue;
                              },
                              'Link text': x => get(x, ['linkText']) || noValue,
                              'Materials specified': x => get(x, ['materialsSpecification']) || noValue,
                              'URL public note': x => get(x, ['publicNote']) || noValue,
                            }}
                            ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
                            containerRef={ref => { this.resultsList = ref; }}
                          />
                        </Accordion>

                        <HoldingAcquisitions
                          holding={holdingsRecord}
                          withSummary={this.props.stripes.hasInterface('orders.holding-summary')}
                        />

                        <HoldingReceivingHistory holding={holdingsRecord} />

                        <HoldingBoundWith boundWithParts={boundWithParts.records} />

                      </AccordionSet>
                    </AccordionStatus>
                  </Pane>
                  {this.state.isVersionHistoryOpen && (
                    <HoldingVersionHistory
                      holdingId={holdingsRecord.id}
                      onClose={() => this.setState({ isVersionHistoryOpen: false })}
                    />
                  )}
                </Paneset>
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
    okapi: PropTypes.object.isRequired,
    user: PropTypes.shape({
      user: PropTypes.shape({
        tenants: PropTypes.arrayOf(PropTypes.object),
        consortium: PropTypes.shape({
          centralTenantId: PropTypes.string,
        }),
      }),
    }),
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
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    instances1: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    holdingsRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
    orderLine: PropTypes.shape({
      GET: PropTypes.func.isRequired,
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
  isVersionHistoryEnabled: PropTypes.bool.isRequired,
  isInstanceShared: PropTypes.bool,
  onUpdateOwnership: PropTypes.func,
  initialTenantId: PropTypes.string,
};

export default flowRight(
  withLocation,
  stripesConnect,
)(ViewHoldingsRecord);
