import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  get,
  cloneDeep,
  map,
  isEmpty,
  values,
  sortBy,
  flowRight,
} from 'lodash';
import { parameterize } from 'inflected';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { effectiveCallNumber } from '@folio/stripes/util';

import {
  Pane,
  Paneset,
  Row,
  Col,
  Accordion,
  AccordionSet,
  AccordionStatus,
  ExpandAllButton,
  KeyValue,
  MultiColumnList,
  Button,
  Icon,
  ConfirmationModal,
  Modal,
  ModalFooter,
  MessageBanner,
  checkScope,
  HasCommand,
  collapseAllSections,
  expandAllSections,
  Layout,
  MenuSection,
  NoValue,
  TextLink,
  PaneMenu,
} from '@folio/stripes/components';

import {
  ViewMetaData,
  ClipCopy,
  TagsAccordion,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  IfPermission,
  CalloutContext,
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';

import { VersionHistoryButton } from '@folio/stripes-acq-components';
import { requestsStatusString } from '../Instance/ViewRequests/utils';

import ModalContent from '../components/ModalContent';
import { ItemAcquisition } from '../Item/ViewItem/ItemAcquisition';
import {
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canMarkRequestAsOpen,
  canCreateNewRequest,
  areAllFieldsEmpty,
  checkIfElementIsEmpty,
  convertArrayToBlocks,
  getDate,
  getDateWithTime,
  checkIfArrayIsEmpty,
  handleKeyCommand,
  switchAffiliation,
  isInstanceShadowCopy,
  omitCurrentAndCentralTenants,
  getIsVersionHistoryEnabled,
} from '../utils';
import withLocation from '../withLocation';
import {
  itemStatusesMap,
  itemStatusMutators,
  noValue,
  REQUEST_OPEN_STATUSES,
  NOT_REMOVABLE_ITEM_STATUSES,
  wrappingCell,
  actionMenuDisplayPerms,
  ITEM_ACCORDIONS,
  ITEM_ACCORDION_LABELS,
  UPDATE_OWNERSHIP_API,
  INVENTORY_AUDIT_GROUP,
} from '../constants';
import ItemStatus from './ItemStatus';
import {
  WarningMessage,
  AdministrativeNoteList,
  ItemViewSubheader,
  PaneLoading,
  BoundPiecesList,
  ActionItem,
  UpdateItemOwnershipModal,
} from '../components';
import {
  useAuditSettings,
  useHoldingMutation,
  useUpdateOwnership,
} from '../hooks';
import { VersionHistory } from './VersionHistory';

export const requestStatusFiltersString = map(REQUEST_OPEN_STATUSES, requestStatus => `requestStatus.${requestStatus}`).join(',');

const ItemView = props => {
  const {
    stripes,
    location,
    match,
    history,
    mutator,
    resources,
    resources: {
      instanceRecords,
      holdingsRecords,
      itemsResource,
      requests,
      staffMembers,
      servicePoints,
      openLoans,
      tagSettings,
    },
    referenceTables,
    referenceTables: {
      holdingsSourcesByName,
    },
    goTo,
    isInstanceShared,
    initialTenantId,
  } = props;

  const ky = useOkapiKy();

  const [itemMissingModal, setItemMissingModal] = useState(false);
  const [itemWithdrawnModal, setItemWithdrawnModal] = useState(false);
  const [confirmDeleteItemModal, setConfirmDeleteItemModal] = useState(false);
  const [cannotDeleteItemModal, setCannotDeleteItemModal] = useState(false);
  const [selectedItemStatus, setSelectedItemStatus] = useState('');
  const [isUpdateOwnershipModalOpen, setIsUpdateOwnershipModalOpen] = useState(false);
  const [cannotDeleteItemModalMessageId, setCannotDeleteItemModalMessageId] = useState('');
  const [isConfirmUpdateOwnershipModalOpen, setIsConfirmUpdateOwnershipModalOpen] = useState(false);
  const [isLinkedLocalOrderLineModalOpen, setIsLinkedLocalOrderLineModalOpen] = useState(false);
  const [updateOwnershipData, setUpdateOwnershipData] = useState({});
  const [tenants, setTenants] = useState([]);
  const [targetTenant, setTargetTenant] = useState({});
  const [isVersionHistoryOpen, setIsSetVersionHistoryOpen] = useState(false);

  const intl = useIntl();
  const calloutContext = useContext(CalloutContext);
  const accordionStatusRef = useRef();
  const { mutateHolding } = useHoldingMutation(targetTenant?.id);
  const { updateOwnership } = useUpdateOwnership(UPDATE_OWNERSHIP_API.ITEMS);

  const { settings } = useAuditSettings({ group: INVENTORY_AUDIT_GROUP });
  const isVersionHistoryEnabled = getIsVersionHistoryEnabled(settings);

  useEffect(() => {
    if (checkIfUserInMemberTenant(stripes)) {
      setTenants(omitCurrentAndCentralTenants(stripes));
    }
  }, []);

  const onClickEditItem = e => {
    if (e) e.preventDefault();

    const tenantFrom = stripes.okapi.tenant;
    const { id, holdingsrecordid, itemid } = match.params;

    history.push({
      pathname: `/inventory/edit/${id}/${holdingsrecordid}/${itemid}`,
      search: location.search,
      state: {
        tenantFrom,
        initialTenantId,
      }
    });
  };

  const goBack = tenantTo => {
    const {
      match: { params: { id } },
      location: { search }
    } = props;

    history.push({
      pathname: `/inventory/view/${id}`,
      search,
      state: { tenantTo },
    });
  };

  const onCloseViewItem = async () => {
    const tenantFrom = location?.state?.initialTenantId || stripes.okapi.tenant;

    await switchAffiliation(stripes, tenantFrom, () => goBack(tenantFrom));
  };

  const deleteItem = item => {
    onCloseViewItem();
    mutator.itemsResource.DELETE(item);
  };

  const onCopy = () => {
    const { itemid, id, holdingsrecordid } = match.params;
    const tenantFrom = stripes.okapi.tenant;

    history.push({
      pathname: `/inventory/copy/${id}/${holdingsrecordid}/${itemid}`,
      search: location.search,
      state: {
        tenantFrom,
        initialTenantId,
      },
    });
  };

  const clearSelectedItemStatus = () => {
    setSelectedItemStatus('');
  };

  const markRequestAsOpen = () => {
    const request = resources?.requests?.records?.[0];

    if (canMarkRequestAsOpen(request)) {
      const newRequestRecord = cloneDeep(request);

      newRequestRecord.status = REQUEST_OPEN_STATUSES.OPEN_NOT_YET_FILLED;
      mutator.requestOnItem.replace({ id: newRequestRecord.id });
      mutator.requests.PUT(newRequestRecord);
    }
  };

  const markItemAsMissing = () => {
    markRequestAsOpen();
    mutator.markItemAsMissing.POST({}).then(() => setItemMissingModal(false));
  };

  const markItemAsWithdrawn = () => {
    mutator.markItemAsWithdrawn.POST({}).then(() => setItemWithdrawnModal(false));
  };

  const markItemWithStatus = status => {
    const {
      [itemStatusMutators[status]]: {
        POST,
      },
    } = mutator;

    POST({}).then(clearSelectedItemStatus);
  };

  const hideMissingModal = () => {
    setItemMissingModal(false);
  };

  const hideWithdrawnModal = () => {
    setItemWithdrawnModal(false);
  };

  const hideConfirmDeleteItemModal = () => {
    setConfirmDeleteItemModal(false);
  };

  const hideCannotDeleteItemModal = () => {
    setCannotDeleteItemModal(false);
  };

  const openUpdateOwnershipModal = () => {
    setIsUpdateOwnershipModalOpen(true);
  };

  const hideUpdateOwnershipModal = () => {
    setIsUpdateOwnershipModalOpen(false);
  };

  const openConfirmUpdateOwnershipModal = () => {
    setIsConfirmUpdateOwnershipModalOpen(true);
  };

  const hideLinkedOrderLineModal = () => {
    setIsLinkedLocalOrderLineModalOpen(false);
  };

  const openLinkedOrderLineModal = () => {
    setIsLinkedLocalOrderLineModalOpen(true);
  };

  const handleUpdateOwnership = () => {
    const { purchaseOrderLineIdentifier } = itemsResource.records[0] || {};

    if (purchaseOrderLineIdentifier) {
      return ky
        .get(`orders/order-lines/${purchaseOrderLineIdentifier}`)
        .json()
        .then(() => {
          openLinkedOrderLineModal();
        }).catch(() => {
          openUpdateOwnershipModal();
        });
    } else {
      return openUpdateOwnershipModal();
    }
  };

  const handleSubmitUpdateOwnership = (tenantId, targetLocation, holdingId) => {
    setUpdateOwnershipData({
      tenantId,
      targetLocation,
      holdingId,
    });
    openConfirmUpdateOwnershipModal();
    hideUpdateOwnershipModal();
  };

  const hideConfirmUpdateOwnershipModal = () => {
    setTargetTenant({});
    setUpdateOwnershipData({});
    setIsConfirmUpdateOwnershipModalOpen(false);
  };

  const canDeleteItem = (item, request) => {
    const itemStatus = get(item, 'status.name');
    const { ON_ORDER } = itemStatusesMap;
    let messageId;

    if (NOT_REMOVABLE_ITEM_STATUSES.includes(itemStatus)) {
      messageId = 'ui-inventory.noItemDeleteModal.statusMessage';
    } else if (itemStatus === ON_ORDER) {
      messageId = 'ui-inventory.noItemDeleteModal.orderMessage';
    } else if (request) {
      messageId = 'ui-inventory.noItemDeleteModal.requestMessage';
    }

    if (messageId) {
      setCannotDeleteItemModal(true);
      setCannotDeleteItemModalMessageId(messageId);
    } else {
      setConfirmDeleteItemModal(true);
    }
  };

  const getActionMenu = ({ onToggle }) => {
    const instance = resources.instanceRecords.records[0];
    const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
    const isSharedInstance = isInstanceShared || isInstanceShadowCopy(instance.source);

    if (isUserInCentralTenant) return null;

    const firstItem = get(resources, 'itemsResource.records[0]');
    const request = get(resources, 'requests.records[0]');
    const newRequestLink = `/requests?itemId=${firstItem.id}&query=${firstItem.id}&layer=create`;
    const userHasPermToCreate = stripes.hasPerm('ui-inventory.item.create');
    const userHasPermToEdit = stripes.hasPerm('ui-inventory.item.edit');
    const canUpdateOwnership = stripes.hasPerm('consortia.inventory.update-ownership.item.post');
    const userHasPermToUpdateOwnership = canUpdateOwnership && isSharedInstance && !isEmpty(tenants);
    const userHasPermToMarkAsMissing = stripes.hasPerm('ui-inventory.item.mark-as-missing.execute');
    const userHasPermToMarkAsWithdrawn = stripes.hasPerm('ui-inventory.items.mark-withdrawn.execute');
    const userHasPermToDelete = stripes.hasPerm('ui-inventory.item.delete');
    const userHasPermToObserveActionMenu = actionMenuDisplayPerms.some(perm => stripes.hasPerm(perm));

    const userCanMarkItemAsMissing = canMarkItemAsMissing(firstItem);
    const userCanMarkItemAsWithdrawn = canMarkItemAsWithdrawn(firstItem);
    const userCanMarkItemWithStatus = canMarkItemWithStatus(firstItem);
    const userCanCreateNewRequest = canCreateNewRequest(firstItem, stripes);

    if (!userHasPermToObserveActionMenu) {
      return null;
    }

    const editActionItem = (
      <ActionItem
        id="clickable-edit-item"
        onClickHandler={() => {
          onToggle();
          onClickEditItem();
        }}
        icon="edit"
        messageId="ui-inventory.editItem"
      />
    );
    const duplicateActionItem = (
      <ActionItem
        id="clickable-copy-item"
        onClickHandler={() => {
          onToggle();
          onCopy();
        }}
        icon="duplicate"
        messageId="ui-inventory.copyItem"
      />
    );
    const updateOwnershipButton = (
      <ActionItem
        id="clickable-update-ownership-item"
        onClickHandler={handleUpdateOwnership}
        icon="profile"
        messageId="ui-inventory.updateOwnership"
      />
    );

    const deleteActionItem = (
      <ActionItem
        id="clickable-delete-item"
        onClickHandler={() => {
          onToggle();
          canDeleteItem(firstItem, request);
        }}
        icon="trash"
        messageId="ui-inventory.deleteItem"
      />
    );
    const newRequestActionItem = (
      <Button
        to={newRequestLink}
        buttonStyle="dropdownItem"
        data-test-inventory-create-request-action
      >
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-inventory.newRequest" />
        </Icon>
      </Button>
    );
    const markAsMissingActionItem = (
      <Button
        id="clickable-missing-item"
        onClick={() => {
          onToggle();
          setItemMissingModal(true);
        }}
        buttonStyle="dropdownItem"
        data-test-mark-as-missing-item
      >
        <Icon icon="flag">
          <FormattedMessage id="ui-inventory.item.status.missing" />
        </Icon>
      </Button>
    );
    const markAsWithdrawnActionItem = (
      <Button
        id="clickable-withdrawn-item"
        onClick={() => {
          onToggle();
          setItemWithdrawnModal(true);
        }}
        buttonStyle="dropdownItem"
        data-test-mark-as-withdrawn-item
      >
        <Icon icon="flag">
          <FormattedMessage id="ui-inventory.item.status.withdrawn" />
        </Icon>
      </Button>
    );

    const renderItemStatusActionItems = () => Object.keys(itemStatusMutators)
      .filter(status => itemStatusesMap[status] !== firstItem?.status?.name)
      .map(status => {
        const itemStatus = itemStatusesMap[status];
        const parameterizedStatus = parameterize(itemStatus);

        const actionMenuItem = (
          <Button
            key={status}
            id={`clickable-${parameterizedStatus}`}
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              setSelectedItemStatus(status);
            }}
          >
            <Icon icon="flag">
              { itemStatus }
            </Icon>
          </Button>
        );

        return (
          <IfPermission
            perm={`ui-inventory.items.mark-${parameterizedStatus}.execute`}
            key={parameterizedStatus}
          >
            {actionMenuItem}
          </IfPermission>
        );
      });

    const isMarkAsMenuSectionVisible = (userCanMarkItemAsMissing && userHasPermToMarkAsMissing)
      || (userHasPermToMarkAsWithdrawn && userCanMarkItemAsWithdrawn)
      || userCanMarkItemWithStatus;

    return (
      <>
        <MenuSection id="items-list-actions">
          {userHasPermToEdit && editActionItem}
          {userHasPermToCreate && duplicateActionItem}
          {userHasPermToUpdateOwnership && updateOwnershipButton}
          {userHasPermToDelete && deleteActionItem}
          {userCanCreateNewRequest && newRequestActionItem}
        </MenuSection>
        {isMarkAsMenuSectionVisible && (
          <MenuSection
            id="items-list-mark-as"
            label={<FormattedMessage id="ui-inventory.markAsHeader" />}
            labelTag="h3"
          >
            {userCanMarkItemAsMissing && userHasPermToMarkAsMissing && markAsMissingActionItem}
            {userCanMarkItemAsWithdrawn && userHasPermToMarkAsWithdrawn && markAsWithdrawnActionItem}
            {userCanMarkItemWithStatus && renderItemStatusActionItems()}
          </MenuSection>
        )}
      </>
    );
  };

  const showSuccessMessageAndGoBack = itemHrid => {
    calloutContext.sendCallout({
      type: 'success',
      message: <FormattedMessage
        id="ui-inventory.updateOwnership.item.message.success"
        values={{
          itemHrid,
          targetTenantName: targetTenant.name,
        }}
      />,
    });

    goBack();
  };

  const resetFormAndCloseModal = () => {
    setTargetTenant({});
    setUpdateOwnershipData({});
    setIsConfirmUpdateOwnershipModalOpen(false);
  };

  const showErrorMessage = () => {
    calloutContext.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.communicationProblem" />,
    });

    resetFormAndCloseModal();
  };

  const showReferenceDataError = () => {
    calloutContext.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.updateOwnership.items.message.error" />,
    });

    resetFormAndCloseModal();
  };

  const createNewHoldingForlocation = async (itemId, targetLocation, targetTenantId) => {
    const instance = instanceRecords.records[0];
    const item = itemsResource.records[0] || {};

    try {
      const newHoldingData = await mutateHolding({
        permanentLocationId: targetLocation.id,
        instanceId: instance.id,
        sourceId: holdingsSourcesByName.FOLIO.id,
      });

      await updateOwnership({
        toHoldingsRecordId: newHoldingData.id,
        itemIds: [itemId],
        targetTenantId,
      });

      showSuccessMessageAndGoBack(item.hrid);
    } catch (e) {
      showErrorMessage();
    }
  };

  const onConfirmHandleUpdateOwnership = async () => {
    const { targetLocation, tenantId, holdingId } = updateOwnershipData;
    const newTenant = stripes.user.user.tenants.find(tenant => tenant.id === tenantId);
    const item = itemsResource.records[0] || {};
    if (targetLocation) {
      createNewHoldingForlocation(item.id, targetLocation, newTenant.id);
    }

    if (holdingId) {
      try {
        await updateOwnership({
          toHoldingsRecordId: holdingId,
          itemIds: [item.id],
          targetTenantId: tenantId,
        });
        showSuccessMessageAndGoBack(item.hrid);
      } catch (error) {
        if (error.response.status === 400) {
          showReferenceDataError();
        } else {
          showErrorMessage();
        }
      }
    }
  };

  const instance = instanceRecords.records[0];
  const item = itemsResource.records[0] || {};
  const holdingsRecord = holdingsRecords.records[0];
  const { locationsById } = referenceTables;
  const permanentHoldingsLocation = locationsById[holdingsRecord?.permanentLocationId];
  const temporaryHoldingsLocation = locationsById[holdingsRecord?.temporaryLocationId];
  const tagsEnabled = !tagSettings?.records?.length || tagSettings?.records?.[0]?.value === 'true';

  const openVersionHistory = useCallback(() => {
    setIsSetVersionHistoryOpen(true);
  }, []);

  const refLookup = (referenceTable, id) => {
    const ref = (referenceTable && id) ? referenceTable.find(record => record.id === id) : {};

    return ref || {};
  };

  const layoutNotes = useCallback((noteTypes, notes) => {
    return noteTypes
      .filter(noteType => notes.find(note => note.itemNoteTypeId === noteType.id))
      .map((noteType, i) => (
        <Row key={i}>
          <Col xs={1}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.staffOnly" />}
              value={notes.map((note, j) => {
                if (note.itemNoteTypeId === noteType.id) {
                  return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                }
                return null;
              })}
            />
          </Col>
          <Col xs={11}>
            <KeyValue
              label={noteType.name}
              value={notes.map((note, j) => {
                if (note.itemNoteTypeId === noteType.id) {
                  return <div key={j}>{note.note || noValue}</div>;
                }
                return null;
              })}
            />
          </Col>
        </Row>
      ));
  }, []);

  const layoutCirculationNotes = useCallback((noteTypes, notes) => {
    return noteTypes
      .filter(noteType => notes.find(note => note.noteType === noteType))
      .map((noteType, i) => (
        <Row key={i}>
          <Col xs={1}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory.staffOnly" />}
              value={notes.map((note, j) => {
                if (note.noteType === noteType) {
                  return <div key={j}>{note.staffOnly ? 'Yes' : 'No'}</div>;
                }
                return null;
              })}
            />
          </Col>
          <Col xs={11}>
            <KeyValue
              label={`${noteType} note`}
              value={notes.map((note, j) => {
                if (note.noteType === noteType) {
                  return <div key={j}>{note.note || noValue}</div>;
                }
                return null;
              })}
            />
          </Col>
        </Row>
      ));
  }, []);

  const confirmDeleteItemModalMessage = useMemo(() => (
    <FormattedMessage
      id="ui-inventory.confirmItemDeleteModal.message"
      values={{
        hrid: item.hrid,
        barcode: item.barcode,
      }}
    />
  ), [item.hrid, item.barcode]);

  const cannotDeleteItemFooter = useMemo(() => (
    <Button
      data-test-cannot-delete-item-back-action
      onClick={hideCannotDeleteItemModal}
    >
      <FormattedMessage id="stripes-core.button.back" />
    </Button>
  ), [hideCannotDeleteItemModal]);

  const administrativeData = useMemo(() => ({
    discoverySuppress: get(instance, 'discoverySuppress', <NoValue />),
    hrid: get(item, 'hrid', <NoValue />),
    barcode: get(item, 'barcode', <NoValue />),
    accessionNumber: get(item, 'accessionNumber', <NoValue />),
    identifier: get(item, 'itemIdentifier', <NoValue />),
    formerIds: get(item, 'formerIds', []),
    statisticalCodeIds: get(item, 'statisticalCodeIds', []),
  }), [instance, item]);

  const itemData = useMemo(() => ({
    materialType: get(item, ['materialType', 'name'], <NoValue />),
    callNumberType: refLookup(referenceTables.callNumberTypes, get(item, 'itemLevelCallNumberTypeId')).name || <NoValue />,
    callNumberPrefix: get(item, 'itemLevelCallNumberPrefix', <NoValue />),
    callNumber: get(item, 'itemLevelCallNumber', <NoValue />),
    callNumberSuffix: get(item, 'itemLevelCallNumberSuffix', <NoValue />),
    copyNumber: get(item, 'copyNumber', <NoValue />),
    numberOfPieces: get(item, 'numberOfPieces', <NoValue />),
    descriptionOfPieces: get(item, 'descriptionOfPieces', <NoValue />),
    effectiveShelvingOrder: get(item, 'effectiveShelvingOrder', <NoValue />),
  }), [item, referenceTables]);

  const enumerationData = useMemo(() => ({
    displaySummary: get(item, 'displaySummary', <NoValue />),
    enumeration: get(item, 'enumeration', <NoValue />),
    chronology: get(item, 'chronology', <NoValue />),
    volume: get(item, 'volume', <NoValue />),
    yearCaption: get(item, 'yearCaption', []),
  }), [item]);

  const condition = useMemo(() => ({
    numberOfMissingPieces: get(item, 'numberOfMissingPieces', <NoValue />),
    missingPieces: get(item, 'missingPieces', <NoValue />),
    missingPiecesDate: getDate(get(item, 'missingPiecesDate')),
    itemDamagedStatus: refLookup(referenceTables.itemDamagedStatuses, get(item, 'itemDamagedStatusId')).name || <NoValue />,
    itemDamagedStatusDate: getDate(get(item, 'itemDamagedStatusDate')),
  }), [item, referenceTables]);

  const itemNotes = useMemo(() => ({
    notes: layoutNotes(referenceTables.itemNoteTypes, get(item, 'notes', [])),
  }), [item, referenceTables, layoutNotes]);

  const holdingLocation = useMemo(() => ({
    permanentLocation: {
      name: get(permanentHoldingsLocation, 'name', <NoValue />),
      isActive: permanentHoldingsLocation?.isActive,
    },
    temporaryLocation: {
      name: get(temporaryHoldingsLocation, 'name', <NoValue />),
      isActive: temporaryHoldingsLocation?.isActive,
    },
  }), [permanentHoldingsLocation, temporaryHoldingsLocation]);

  const itemLocation = useMemo(() => ({
    permanentLocation: {
      name: get(item, ['permanentLocation', 'name'], <NoValue />),
      isActive: locationsById[item.permanentLocation?.id]?.isActive,
    },
    temporaryLocation: {
      name: get(item, ['temporaryLocation', 'name'], <NoValue />),
      isActive: locationsById[item.temporaryLocation?.id]?.isActive,
    },
    effectiveLocation: {
      name: get(item, ['effectiveLocation', 'name'], <NoValue />),
      isActive: locationsById[item.effectiveLocation?.id]?.isActive,
    },
  }), [item, locationsById]);

  const isLoading = () => {
    return !itemsResource?.hasLoaded || !instanceRecords?.hasLoaded || !holdingsRecords?.hasLoaded;
  };

  if (isLoading()) {
    return <PaneLoading defaultWidth="100%" />;
  }

  const {
    MISSING,
    WITHDRAWN,
  } = itemStatusesMap;

  const staffMember = get(staffMembers, 'records[0]');
  const openLoan = get(openLoans, 'records[0]');
  const source = staffMember ?
    <Link to={`/users/view/${staffMember.id}`}>
      {`${staffMember.personal.lastName}, ${staffMember.personal.firstName} ${staffMember.personal.middleName || ''}`}
    </Link> :
    <NoValue />;

  const requestCount = requests.other?.totalRecords ?? 0;

  const requestsUrl = `/requests?filters=${requestStatusFiltersString}&query=${item.id}&sort=Request Date`;

  let borrowerLink = <NoValue />;

  if (openLoan?.borrower) {
    borrowerLink = <Link to={`/users/view/${openLoan.userId}`}>{openLoan.borrower.barcode}</Link>;
  }

  const loanAndAvailability = {
    permanentLoanType: get(item, ['permanentLoanType', 'name'], <NoValue />),
    temporaryLoanType: get(item, ['temporaryLoanType', 'name'], <NoValue />),
    itemStatusDate: getDateWithTime(item?.status?.date),
    requestLink: requestCount ? <Link to={requestsUrl}>{requestCount}</Link> : 0,
    borrower: borrowerLink,
    loanDate: openLoan ? getDateWithTime(openLoan.loanDate) : <NoValue />,
    dueDate: openLoan ? getDateWithTime(openLoan.dueDate) : <NoValue />,
    circulationNotes: layoutCirculationNotes(['Check out', 'Check in'], get(item, 'circulationNotes', [])),
  };

  const emptyNotes = (
    <Row>
      <Col xs={1}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.staffOnly" />}
          value={noValue}
        />
      </Col>
      <Col xs={11}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory.note" />}
          value={noValue}
        />
      </Col>
    </Row>
  );

  const electronicAccess = { electronicAccess: get(item, 'electronicAccess', []) };

  const checkInDate = getDateWithTime(get(item, ['lastCheckIn', 'dateTime']));

  const servicePointName = checkInDate === '-' ? <NoValue /> : get(servicePoints, 'records[0].name', <NoValue />);

  const circulationHistory = {
    checkInDate,
    servicePointName,
    source,
  };

  item.boundWithTitles = sortBy(
    item?.boundWithTitles,
    [(boundWithTitle) => {
      return boundWithTitle?.briefHoldingsRecord?.id === item?.holdingsRecordId ? 0 : 1;
    }]
  );
  const boundWithTitles = item?.boundWithTitles;

  const initialAccordionsState = {
    acc01: !areAllFieldsEmpty(values(administrativeData)),
    acc02: !areAllFieldsEmpty(values(itemData)),
    acc03: !areAllFieldsEmpty(values(enumerationData)),
    acc04: !areAllFieldsEmpty(values(condition)),
    acc05: !areAllFieldsEmpty(values(itemNotes)),
    acc06: !areAllFieldsEmpty(values(loanAndAvailability)),
    acc07: !areAllFieldsEmpty([...values(holdingLocation), ...values(itemLocation)]),
    acc08: !areAllFieldsEmpty(values(electronicAccess)),
    acc09: !areAllFieldsEmpty(values(circulationHistory)),
    acc10: !areAllFieldsEmpty(values(boundWithTitles)),
    itemAcquisitionAccordion: true,
  };

  const statisticalCodeContent = !isEmpty(administrativeData.statisticalCodeIds)
    ? administrativeData.statisticalCodeIds.map(id => ({ codeId: id }))
    : [{ codeId: <NoValue /> }];

  const statisticalCodeFormatter = {
    'Statistical code type': x => refLookup(referenceTables.statisticalCodeTypes,
      refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).statisticalCodeTypeId).name || noValue,
    'Statistical code name': x => refLookup(referenceTables.statisticalCodes, get(x, ['codeId'])).name || noValue,
  };

  const electronicAccessFormatter = {
    'URL relationship': x => refLookup(referenceTables.electronicAccessRelationships,
      get(x, ['relationshipId'])).name || noValue,
    'URI': x => {
      const uri = x?.uri;

      return uri
        ? (
          <TextLink
            href={uri}
            rel="noreferrer noopener"
            target="_blank"
            style={wrappingCell}
          >
            {uri}
          </TextLink>
        )
        : noValue;
    },
    'Link text': x => get(x, ['linkText']) || noValue,
    'Materials specified': x => get(x, ['materialsSpecification']) || noValue,
    'URL public note': x => get(x, ['publicNote']) || noValue,
  };

  const boundWithTitleFormatter = {
    'Instance HRID': x => {
      return (
        <Link
          to={`/inventory/view/${x.briefInstance?.id}`}
          className="instanceHrid"
        >
          <span>{x.briefInstance?.hrid}</span>
        </Link>
      );
    },
    'Instance title': x => x.briefInstance?.title,
    'Holdings HRID': x => {
      return (
        <Link
          to={`/inventory/view/${x.briefInstance?.id}/${x.briefHoldingsRecord?.id}`}
          className="holdingsRecordHrid"
        >
          <span>{x.briefHoldingsRecord?.hrid}</span>
        </Link>
      );
    },
  };

  const effectiveLocationDisplay = (
    <Col xs={2}>
      <KeyValue
        label={<FormattedMessage id="ui-inventory.effectiveLocation" />}
        value={checkIfElementIsEmpty(itemLocation.effectiveLocation?.name)}
        subValue={!itemLocation.effectiveLocation?.isActive &&
          <FormattedMessage id="ui-inventory.inactive" />
        }
        data-testid="item-effective-location"
      />
    </Col>
  );

  const shortcuts = [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.item.edit')) onClickEditItem();
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => goTo('/inventory')),
    },
    {
      name: 'duplicateRecord',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-inventory.item.create')) onCopy();
      }),
    },
  ];

  const currentTenantId = stripes.okapi.tenant;
  const currentTenant = stripes.user?.user?.tenants?.find(tenant => tenant.id === currentTenantId);

  const itemRecord = resources.itemsResource.records[0];
  // getEntity needs to return an object from a closure so that Tags can compare old and new entity versions
  const getEntity = () => itemRecord;
  const getEntityTags = () => itemRecord?.tags?.tagList || [];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset isRoot>
        <Pane
          data-test-item-view-page
          defaultWidth="fill"
          id="item-view-pane"
          appIcon={(
            <AppIcon
              app="inventory"
              iconKey="item"
            />
          )}
          paneTitle={(
            <span data-test-header-item-title>
              <FormattedMessage
                id="ui-inventory.itemDotStatus"
                values={{
                  barcode: get(item, 'barcode', ''),
                  status: get(item, 'status.name', ''),
                }}
              />
            </span>
          )}
          paneSub={(
            <FormattedMessage
              id="ui-inventory.instanceRecordSubtitle"
              values={{
                hrid: item?.hrid,
                updatedDate: getDate(item?.metadata?.updatedDate),
              }}
            />
          )}
          dismissible
          onClose={onCloseViewItem}
          actionMenu={(params) => !isVersionHistoryOpen && getActionMenu(params)}
          lastMenu={(
            <PaneMenu>
              {isVersionHistoryEnabled && (
                <VersionHistoryButton
                  onClick={openVersionHistory}
                  disabled={isVersionHistoryOpen}
                />
              )}
            </PaneMenu>
          )}
        >
          <UpdateItemOwnershipModal
            isOpen={isUpdateOwnershipModalOpen}
            handleSubmit={handleSubmitUpdateOwnership}
            tenantsList={tenants}
            onCancel={hideUpdateOwnershipModal}
            onChangeAffiliation={setTargetTenant}
            targetTenantId={targetTenant?.id}
            instanceId={instance.id}
          />
          <ConfirmationModal
            id="update-ownership-modal"
            open={isConfirmUpdateOwnershipModalOpen}
            heading={<FormattedMessage id="ui-inventory.updateOwnership.items.modal.heading" />}
            message={
              <FormattedMessage
                id="ui-inventory.updateOwnership.items.modal.message"
                values={{
                  currentTenant: currentTenant?.name,
                  targetTenant: targetTenant?.name,
                  itemHrid: itemRecord.hrid,
                }}
              />
            }
            onConfirm={onConfirmHandleUpdateOwnership}
            onCancel={hideConfirmUpdateOwnershipModal}
            confirmLabel={<FormattedMessage id="ui-inventory.confirm" />}
          />
          <Modal
            id="linked-local-order-line-confirmation-modal"
            open={isLinkedLocalOrderLineModalOpen}
            label={<FormattedMessage id="ui-inventory.hasLinkedLocalOrderLine.modal.heading" />}
            footer={(
              <ModalFooter>
                <Button
                  buttonStyle="primary"
                  onClick={hideLinkedOrderLineModal}
                  marginBottom0
                >
                  <FormattedMessage id="stripes-core.button.continue" />
                </Button>
              </ModalFooter>
              )}
          >
            <FormattedMessage id="ui-inventory.hasLinkedLocalOrderLine.modal.message" />
          </Modal>
          <Modal
            data-testid="missing-confirmation-modal"
            data-test-missingConfirmation-modal
            open={itemMissingModal}
            label={<FormattedMessage id="ui-inventory.missingModal.heading" />}
            dismissible
            size="small"
            onClose={hideMissingModal}
          >
            <ModalContent
              item={item}
              itemRequestCount={requestCount}
              status={MISSING}
              requestsUrl={requestsUrl}
              onConfirm={markItemAsMissing}
              onCancel={hideMissingModal}
            />
          </Modal>
          <Modal
            data-testid="withdrawn-confirmation-modal"
            data-test-withdrawn-confirmation-modal
            open={itemWithdrawnModal}
            label={<FormattedMessage id="ui-inventory.withdrawnModal.heading" />}
            dismissible
            size="small"
            onClose={hideWithdrawnModal}
          >
            <ModalContent
              item={item}
              itemRequestCount={requestCount}
              status={WITHDRAWN}
              requestsUrl={requestsUrl}
              onConfirm={markItemAsWithdrawn}
              onCancel={hideWithdrawnModal}
            />
          </Modal>
          <Modal
            data-test-item-status-modal
            open={!!selectedItemStatus}
            label={<FormattedMessage
              id="ui-inventory.itemStatusModal.heading"
              values={{ itemStatus: itemStatusesMap[selectedItemStatus] }}
            />}
            dismissible
            size="small"
            onClose={clearSelectedItemStatus}
          >
            <ModalContent
              item={item}
              itemRequestCount={requestCount}
              status={itemStatusesMap[selectedItemStatus]}
              requestsUrl={requestsUrl}
              onConfirm={() => markItemWithStatus(selectedItemStatus)}
              onCancel={clearSelectedItemStatus}
            />
          </Modal>
          <ConfirmationModal
            id="confirmDeleteItemModal"
            data-test-confirm-delete-item-modal
            open={confirmDeleteItemModal}
            heading={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
            message={confirmDeleteItemModalMessage}
            onConfirm={() => { deleteItem(item); }}
            onCancel={hideConfirmDeleteItemModal}
            confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
          />
          {cannotDeleteItemModal && (
          <Modal
            id="cannotDeleteItemModal"
            data-test-cannot-delete-item-modal
            label={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
            open={cannotDeleteItemModal}
            footer={cannotDeleteItemFooter}
          >
            <FormattedMessage
              id={cannotDeleteItemModalMessageId}
              values={{
                hrid: item.hrid,
                barcode: item.barcode,
                status: item.status.name,
              }}
            />
          </Modal>
          )}
          <ItemViewSubheader
            item={item}
            instance={instance}
            holdingsRecord={holdingsRecord}
            holdingLocation={holdingLocation}
          />
          <br />
          <AccordionStatus ref={accordionStatusRef}>
            <Row>
              {effectiveLocationDisplay}
              <Col xs={2}>
                <Layout className="display-flex flex-align-items-start">
                  <KeyValue
                    label={<FormattedMessage id="ui-inventory.effectiveCallNumber" />}
                    value={effectiveCallNumber(item)}
                  />
                </Layout>
              </Col>
              <Col xs={7}>
                <Row middle="xs">
                  <MessageBanner show={Boolean(item.discoverySuppress)} type="warning">
                    <FormattedMessage id="ui-inventory.warning.item.suppressedFromDiscovery" />
                  </MessageBanner>
                </Row>
              </Col>
              <Col xs={1}>
                <Row end="xs">
                  <Col>
                    <ExpandAllButton />
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <AccordionSet initialStatus={initialAccordionsState}>
              <Accordion
                id="acc01"
                label={<FormattedMessage id="ui-inventory.administrativeData" />}
              >
                <ViewMetaData metadata={item.metadata} />
                <Row>
                  <Col xs={12}>
                    {item.discoverySuppress && <WarningMessage id="ui-inventory.discoverySuppressed" />}
                  </Col>
                </Row>
                {item.discoverySuppress && <br />}
                <Row>
                  <Col xs={2}>
                    <KeyValue label={<FormattedMessage id="ui-inventory.itemHrid" />}>
                      {checkIfElementIsEmpty(administrativeData.hrid)}
                      {Boolean(administrativeData.hrid) && <ClipCopy text={administrativeData.hrid} />}
                    </KeyValue>
                  </Col>
                  <Col xs={2}>
                    <KeyValue label={<FormattedMessage id="ui-inventory.itemBarcode" />}>
                      {checkIfElementIsEmpty(administrativeData.barcode)}
                      {Boolean(administrativeData.barcode) && <ClipCopy text={administrativeData.barcode} />}
                    </KeyValue>
                  </Col>
                  <Col xs={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.accessionNumber" />}
                      value={checkIfElementIsEmpty(administrativeData.accessionNumber)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.itemIdentifier" />}
                      value={checkIfElementIsEmpty(administrativeData.identifier)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={2}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.formerId" />}
                      value={convertArrayToBlocks(administrativeData.formerIds)}
                    />
                  </Col>
                </Row>
                <Row>
                  <MultiColumnList
                    id="item-list-statistical-codes"
                    contentData={statisticalCodeContent}
                    visibleColumns={['Statistical code type', 'Statistical code name']}
                    columnMapping={{
                      'Statistical code type': intl.formatMessage({ id: 'ui-inventory.statisticalCodeType' }),
                      'Statistical code name': intl.formatMessage({ id: 'ui-inventory.statisticalCodeName' }),
                    }}
                    formatter={statisticalCodeFormatter}
                    ariaLabel={intl.formatMessage({ id: 'ui-inventory.statisticalCodes' })}
                  />
                </Row>
                <Row>
                  <Col xs={12}>
                    <AdministrativeNoteList administrativeNotes={item.administrativeNotes} />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                id="acc02"
                label={<FormattedMessage id="ui-inventory.itemData" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <strong>
                      <FormattedMessage id="ui-inventory.materialType" />
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <KeyValue value={checkIfElementIsEmpty(itemData.materialType)} />
                  </Col>
                </Row>
                <Row>
                  <Col sm={3}>
                    <Layout className="display-flex flex-align-items-start">
                      <KeyValue
                        label={<FormattedMessage id="ui-inventory.shelvingOrder" />}
                        value={checkIfElementIsEmpty(itemData.effectiveShelvingOrder)}
                      />
                    </Layout>
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <strong>
                      <FormattedMessage id="ui-inventory.itemCallNumber" />
                    </strong>
                  </Col>
                </Row>
                <Row>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberType" />}
                      value={checkIfElementIsEmpty(itemData.callNumberType)}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberPrefix" />}
                      value={checkIfElementIsEmpty(itemData.callNumberPrefix)}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumber" />}
                      value={checkIfElementIsEmpty(itemData.callNumber)}
                    />
                  </Col>
                  <Col sm={2}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.callNumberSuffix" />}
                      value={checkIfElementIsEmpty(itemData.callNumberSuffix)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={2}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.copyNumber" />}
                      value={checkIfElementIsEmpty(itemData.copyNumber)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={2}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.numberOfPieces" />}
                      value={checkIfElementIsEmpty(itemData.numberOfPieces)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.descriptionOfPieces" />}
                      value={checkIfElementIsEmpty(itemData.descriptionOfPieces)}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                id="acc03"
                label={<FormattedMessage id="ui-inventory.enumerationData" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.displaySummary" />}
                      value={checkIfElementIsEmpty(enumerationData.displaySummary)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.enumeration" />}
                      value={checkIfElementIsEmpty(enumerationData.enumeration)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.chronology" />}
                      value={checkIfElementIsEmpty(enumerationData.chronology)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.volume" />}
                      value={checkIfElementIsEmpty(enumerationData.volume)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={8}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.yearCaption" />}
                      value={convertArrayToBlocks(enumerationData.yearCaption)}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                id="acc04"
                label={<FormattedMessage id="ui-inventory.condition" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.numberOfMissingPieces" />}
                      value={checkIfElementIsEmpty(condition.numberOfMissingPieces)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.missingPieces" />}
                      value={checkIfElementIsEmpty(condition.missingPieces)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.date" />}
                      value={checkIfElementIsEmpty(condition.missingPiecesDate)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.itemDamagedStatus" />}
                      value={checkIfElementIsEmpty(condition.itemDamagedStatus)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.date" />}
                      value={checkIfElementIsEmpty(condition.itemDamagedStatusDate)}
                    />
                  </Col>
                </Row>
              </Accordion>

              {tagsEnabled && (
                <TagsAccordion
                  link={`inventory/items/${item.id}`}
                  getEntity={getEntity}
                  getEntityTags={getEntityTags}
                  entityTagsPath="tags"
                  hasOptimisticLocking
                />
              )}

              <Accordion
                id="acc05"
                label={<FormattedMessage id="ui-inventory.itemNotes" />}
              >
                {!isEmpty(itemNotes.notes) ? itemNotes.notes : emptyNotes}
              </Accordion>
              <Accordion
                id="acc06"
                label={<FormattedMessage id="ui-inventory.item.loanAndAvailability" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.permanentLoantype" />}
                      value={checkIfElementIsEmpty(loanAndAvailability.permanentLoanType)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.temporaryLoantype" />}
                      value={checkIfElementIsEmpty(loanAndAvailability.temporaryLoanType)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <ItemStatus
                      itemId={item.id}
                      status={item.status}
                      openLoan={openLoan}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.item.availability.requests" />}
                      value={checkIfElementIsEmpty(loanAndAvailability.requestLink)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.item.availability.borrower" />}
                      value={checkIfElementIsEmpty(loanAndAvailability.borrower)}
                    />
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.loanDate" />}>
                      {checkIfElementIsEmpty(loanAndAvailability.loanDate)}
                    </KeyValue>
                  </Col>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <KeyValue label={<FormattedMessage id="ui-inventory.item.availability.dueDate" />}>
                      {checkIfElementIsEmpty(loanAndAvailability.dueDate)}
                    </KeyValue>
                  </Col>
                </Row>
                {!isEmpty(loanAndAvailability.circulationNotes) ? loanAndAvailability.circulationNotes : emptyNotes}
              </Accordion>
              <Accordion
                id="acc07"
                label={<FormattedMessage id="ui-inventory.location" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
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
                      label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                      value={checkIfElementIsEmpty(holdingLocation.permanentLocation.name)}
                      subValue={!holdingLocation.permanentLocation?.isActive &&
                        <FormattedMessage id="ui-inventory.inactive" />
                      }
                      data-testid="holding-permanent-location"
                    />
                  </Col>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                      value={checkIfElementIsEmpty(holdingLocation.temporaryLocation.name)}
                      subValue={holdingLocation.temporaryLocation?.isActive === false &&
                        <FormattedMessage id="ui-inventory.inactive" />
                      }
                      data-testid="holding-temporary-location"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <strong>
                      <FormattedMessage id="ui-inventory.itemLocation" />
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
                      label={<FormattedMessage id="ui-inventory.permanentLocation" />}
                      value={checkIfElementIsEmpty(itemLocation.permanentLocation.name)}
                      subValue={itemLocation.permanentLocation?.isActive === false &&
                        <FormattedMessage id="ui-inventory.inactive" />
                      }
                      data-testid="item-permanent-location"
                    />
                  </Col>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.temporaryLocation" />}
                      value={checkIfElementIsEmpty(itemLocation.temporaryLocation.name)}
                      subValue={itemLocation.temporaryLocation?.isActive === false &&
                        <FormattedMessage id="ui-inventory.inactive" />
                      }
                      data-testid="item-temporary-location"
                    />
                  </Col>
                </Row>
                <Row>
                  {effectiveLocationDisplay}
                </Row>
              </Accordion>

              {
                item.purchaseOrderLineIdentifier && (
                  <ItemAcquisition
                    itemId={item.id}
                    accordionId="itemAcquisitionAccordion"
                  />
                )
              }

              <Accordion
                id="acc08"
                label={<FormattedMessage id="ui-inventory.electronicAccess" />}
              >
                <MultiColumnList
                  id="item-list-electronic-access"
                  contentData={checkIfArrayIsEmpty(electronicAccess.electronicAccess)}
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
                  formatter={electronicAccessFormatter}
                  ariaLabel={intl.formatMessage({ id: 'ui-inventory.electronicAccess' })}
                />
              </Accordion>
              <Accordion
                id="acc09"
                label={<FormattedMessage id="ui-inventory.circulationHistory" />}
              >
                <Row>
                  <Col
                    smOffset={0}
                    sm={4}
                  >
                    <FormattedMessage
                      tagName="strong"
                      id="ui-inventory.mostRecentCheckIn"
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.checkInDate" />}
                      value={checkIfElementIsEmpty(circulationHistory.checkInDate)}
                    />
                  </Col>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.servicePoint" />}
                      value={checkIfElementIsEmpty(circulationHistory.servicePointName)}
                    />
                  </Col>
                  <Col sm={4}>
                    <KeyValue
                      label={<FormattedMessage id="ui-inventory.source" />}
                      value={checkIfElementIsEmpty(circulationHistory.source)}
                    />
                  </Col>
                </Row>
              </Accordion>
              <Accordion
                id="acc10"
                label={<FormattedMessage id="ui-inventory.boundWithTitles" />}
              >
                <MultiColumnList
                  id="item-list-bound-with-titles"
                  contentData={checkIfArrayIsEmpty(boundWithTitles)}
                  visibleColumns={['Instance HRID', 'Instance title', 'Holdings HRID']}
                  columnMapping={{
                    'Instance HRID': intl.formatMessage({ id: 'ui-inventory.instanceHrid' }),
                    'Instance title': intl.formatMessage({ id: 'ui-inventory.instanceTitleLabel' }),
                    'Holdings HRID': intl.formatMessage({ id: 'ui-inventory.holdingsHrid' }),
                  }}
                  formatter={boundWithTitleFormatter}
                  ariaLabel={intl.formatMessage({ id: 'ui-inventory.boundWithTitles' })}
                />
              </Accordion>
              <Accordion
                id={ITEM_ACCORDIONS.boundItems}
                label={ITEM_ACCORDION_LABELS.boundItems}
              >
                <BoundPiecesList
                  id="bound-pieces-list"
                  itemId={item.id}
                  instanceId={instance.id}
                />
              </Accordion>
            </AccordionSet>
          </AccordionStatus>
        </Pane>
        {isVersionHistoryOpen && (
          <VersionHistory
            onClose={() => setIsSetVersionHistoryOpen(false)}
          />
        )}
      </Paneset>
    </HasCommand>
  );
};

ItemView.manifest = Object.freeze({
  query: {},
  itemsResource: {
    type: 'okapi',
    path: 'inventory/items/:{itemid}',
    POST: { path: 'inventory/items' },
    resourceShouldRefresh: true,
    tenant: '!{tenantTo}',
  },
  markItemAsWithdrawn: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-withdrawn',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markItemAsMissing: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-missing',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsInProcess: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-in-process',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsInProcessNonRequestable: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-in-process-non-requestable',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsIntellectualItem: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-intellectual-item',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsLongMissing: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-long-missing',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsRestricted: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-restricted',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsUnavailable: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-unavailable',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  markAsUnknown: {
    type: 'okapi',
    POST: {
      path: 'inventory/items/:{itemid}/mark-unknown',
    },
    clientGeneratePk: false,
    fetch: false,
  },
  holdingsRecords: {
    type: 'okapi',
    path: 'holdings-storage/holdings/:{holdingsrecordid}',
    tenant: '!{tenantTo}',
  },
  instanceRecords: {
    type: 'okapi',
    path: 'inventory/instances/:{id}',
    resourceShouldRefresh: true,
  },
  servicePoints: {
    type: 'okapi',
    path: 'service-points',
    records: 'servicepoints',
    params: (_q, _p, _r, _l, props) => {
      // Only one service point is of interest here: the SP used for the item's last check-in
      // (if the item has a check-in). Iff that service point ID is found, add a query param
      // to filter down to that one service point in the records returned.
      const servicePointId = get(props.resources, 'itemsResource.records[0].lastCheckIn.servicePointId', '');
      const query = servicePointId && `id==${servicePointId}`;
      return query ? { query } : {};
    },
    resourceShouldRefresh: true,
  },
  staffMembers: {
    type: 'okapi',
    path: 'users',
    records: 'users',
    params: (_q, _p, _r, _l, props) => {
      const staffMemberId = get(props.resources, 'itemsResource.records[0].lastCheckIn.staffMemberId', '');
      const query = staffMemberId && `id==${staffMemberId}`;

      return query ? { query } : null;
    },
    resourceShouldRefresh: true,
  },
  // return a count of the requests matching the given item and status
  requests: {
    type: 'okapi',
    path: `circulation/requests?query=(itemId==:{itemid}) and status==(${requestsStatusString}) sortby requestDate desc&limit=1`,
    records: 'requests',
    PUT: { path: 'circulation/requests/%{requestOnItem.id}' },
  },
  openLoans: {
    type: 'okapi',
    path: 'circulation/loans',
    params: {
      query: 'status.name=="Open" and itemId==:{itemid}',
    },
    records: 'loans',
  },
  requestOnItem: {},
  tagSettings: {
    type: 'okapi',
    records: 'configs',
    path: 'configurations/entries?query=(module==TAGS and configName==tags_enabled)',
  },
});

ItemView.propTypes = {
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.shape({
      tenant: PropTypes.string,
    }),
    user: PropTypes.shape({
      user: PropTypes.shape({
        tenants: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  }).isRequired,
  resources: PropTypes.shape({
    instanceRecords: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    loanTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    requests: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
      other: PropTypes.object,
    }),
    loans: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    itemsResource: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    holdingsRecords: PropTypes.shape({
      hasLoaded: PropTypes.bool,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    callNumberTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    borrower: PropTypes.object,
    staffMembers: PropTypes.object,
    servicePoints: PropTypes.object,
    openLoans: PropTypes.object,
    tagSettings: PropTypes.object,
  }).isRequired,
  location: PropTypes.object,
  referenceTables: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    itemsResource: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }),
    markItemAsWithdrawn: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markItemAsMissing: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsInProcess: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsInProcessNonRequestable: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsIntellectualItem: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsLongMissing: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsRestricted: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsUnavailable: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    markAsUnknown: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }),
    requests: PropTypes.shape({ PUT: PropTypes.func.isRequired }),
    requestOnItem: PropTypes.shape({ replace: PropTypes.func.isRequired }),
  }),
  goTo: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isInstanceShared: PropTypes.bool,
  initialTenantId: PropTypes.string,
};

export default flowRight(
  stripesConnect,
  withLocation,
)(ItemView);
