import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  ConfirmationModal,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import UpdateItemOwnershipModal from '../UpdateItemOwnershipModal';
import ModalContent from '../ModalContent';

import { useItemModalsContext } from '../../../hooks';

import { itemStatusesMap } from '../../../../constants';

const ItemModals = ({
  onSelectNewItemOwnership,
  onConfirmHandleUpdateOwnership,
  onCancelUpdateOwnership,
  onChangeAffiliation,
  onMarkItemAsMissing,
  onMarkItemAsWithdrawn,
  onMarkItemWithStatus,
  onDeleteItem,
  item,
  instanceId,
  targetTenant,
  tenants = [],
  requestCount,
  requestsUrl,
}) => {
  const stripes = useStripes();

  const currentTenantId = stripes.okapi.tenant;
  const currentTenant = stripes.user?.user?.tenants?.find(tenant => tenant.id === currentTenantId);

  const {
    isUpdateOwnershipModalOpen,
    isConfirmUpdateOwnershipModalOpen,
    isLinkedLocalOrderLineModalOpen,
    isItemMissingModalOpen,
    isItemWithdrawnModalOpen,
    isSelectedItemStatusModalOpen,
    isConfirmDeleteItemModalOpen,
    isCannotDeleteItemModalOpen,
    selectedItemStatus,
    cannotDeleteItemModalMessageId,

    setIsConfirmUpdateOwnershipModalOpen,
    setIsUpdateOwnershipModalOpen,
    setIsLinkedLocalOrderLineModalOpen,
    setIsItemMissingModalOpen,
    setIsItemWithdrawnModalOpen,
    setIsConfirmDeleteItemModalOpen,
    setIsCannotDeleteItemModalOpen,
    setIsSelectedItemStatusModalOpen,
    setSelectedItemStatus,
  } = useItemModalsContext();

  const confirmDeleteItemModalMessage = useMemo(() => (
    <FormattedMessage
      id="ui-inventory.confirmItemDeleteModal.message"
      values={{
        hrid: item.hrid,
        barcode: item.barcode,
      }}
    />
  ), [item.hrid, item.barcode]);

  const {
    MISSING,
    WITHDRAWN,
  } = itemStatusesMap;

  const openConfirmUpdateOwnershipModal = () => {
    setIsConfirmUpdateOwnershipModalOpen(true);
  };
  const closeUpdateOwnershipModal = () => {
    setIsUpdateOwnershipModalOpen(false);
  };
  const closeLinkedOrderLineModal = () => {
    setIsLinkedLocalOrderLineModalOpen(false);
  };
  const closeSetItemMissingModal = () => {
    setIsItemMissingModalOpen(false);
  };
  const closeSetItemWithdrawnModal = () => {
    setIsItemWithdrawnModalOpen(false);
  };
  const closeSetItemStatusModal = () => {
    setIsSelectedItemStatusModalOpen(false);
  };
  const closeConfirmDeleteItemModal = () => {
    setIsConfirmDeleteItemModalOpen(false);
  };
  const closeCannotDeleteItemModal = () => {
    setIsCannotDeleteItemModalOpen(false);
  };

  const handleSubmitUpdateOwnership = (tenantId, targetLocation, holdingId) => {
    onSelectNewItemOwnership({ tenantId, targetLocation, holdingId });
    closeUpdateOwnershipModal();
    openConfirmUpdateOwnershipModal();
  };
  const handleCancelUpdateOwnership = () => {
    onCancelUpdateOwnership();
    setIsConfirmUpdateOwnershipModalOpen(false);
  };
  const handleMarkItemAsMissing = async () => {
    await onMarkItemAsMissing();
    closeSetItemMissingModal();
  };
  const handleMarkItemAsWithdrawn = async () => {
    await onMarkItemAsWithdrawn();
    closeSetItemWithdrawnModal();
  };
  const clearSelectedItemStatus = () => {
    setSelectedItemStatus('');
  };
  const handleMarkItemWithStatus = async () => {
    await onMarkItemWithStatus(selectedItemStatus);
    clearSelectedItemStatus();
    closeSetItemStatusModal();
  };
  const handleDeleteItem = async () => {
    await onDeleteItem(item.id);
  };

  return (
    <>
      <UpdateItemOwnershipModal
        isOpen={isUpdateOwnershipModalOpen}
        handleSubmit={handleSubmitUpdateOwnership}
        tenantsList={tenants}
        onCancel={closeUpdateOwnershipModal}
        onChangeAffiliation={onChangeAffiliation}
        targetTenantId={targetTenant?.id}
        instanceId={instanceId}
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
              itemHrid: item.hrid,
            }}
          />
        }
        onConfirm={onConfirmHandleUpdateOwnership}
        onCancel={handleCancelUpdateOwnership}
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
              onClick={closeLinkedOrderLineModal}
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
        open={isItemMissingModalOpen}
        label={<FormattedMessage id="ui-inventory.missingModal.heading" />}
        dismissible
        size="small"
        onClose={closeSetItemMissingModal}
      >
        <ModalContent
          item={item}
          itemRequestCount={requestCount}
          status={MISSING}
          requestsUrl={requestsUrl}
          onConfirm={handleMarkItemAsMissing}
          onCancel={closeSetItemMissingModal}
        />
      </Modal>
      <Modal
        data-testid="withdrawn-confirmation-modal"
        open={isItemWithdrawnModalOpen}
        label={<FormattedMessage id="ui-inventory.withdrawnModal.heading" />}
        dismissible
        size="small"
        onClose={closeSetItemWithdrawnModal}
      >
        <ModalContent
          item={item}
          itemRequestCount={requestCount}
          status={WITHDRAWN}
          requestsUrl={requestsUrl}
          onConfirm={handleMarkItemAsWithdrawn}
          onCancel={closeSetItemWithdrawnModal}
        />
      </Modal>
      <Modal
        open={isSelectedItemStatusModalOpen}
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
          onConfirm={handleMarkItemWithStatus}
          onCancel={clearSelectedItemStatus}
        />
      </Modal>
      <ConfirmationModal
        id="confirmDeleteItemModal"
        data-testid="confirm-delete-item-modal"
        open={isConfirmDeleteItemModalOpen}
        heading={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
        message={confirmDeleteItemModalMessage}
        onConfirm={handleDeleteItem}
        onCancel={closeConfirmDeleteItemModal}
        confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
      />
      <Modal
        id="cannotDeleteItemModal"
        label={<FormattedMessage id="ui-inventory.confirmItemDeleteModal.heading" />}
        open={isCannotDeleteItemModalOpen}
        footer={(
          <ModalFooter>
            <Button
              data-test-cannot-delete-item-back-action
              buttonStyle="primary"
              onClick={closeCannotDeleteItemModal}
              marginBottom0
            >
              <FormattedMessage id="stripes-core.button.back" />
            </Button>
          </ModalFooter>
        )}
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
    </>
  );
};

ItemModals.propTypes = {
  onSelectNewItemOwnership: PropTypes.func.isRequired,
  onConfirmHandleUpdateOwnership: PropTypes.func.isRequired,
  onCancelUpdateOwnership: PropTypes.func.isRequired,
  onChangeAffiliation: PropTypes.func.isRequired,
  onMarkItemAsMissing: PropTypes.func.isRequired,
  onMarkItemAsWithdrawn: PropTypes.func.isRequired,
  onMarkItemWithStatus: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  targetTenant: PropTypes.object,
  tenants: PropTypes.arrayOf(PropTypes.object),
  requestCount: PropTypes.number,
  requestsUrl: PropTypes.string,
};

export default ItemModals;
