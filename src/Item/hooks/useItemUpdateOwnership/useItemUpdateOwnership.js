import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useHoldingMutation from '../../../hooks/useHoldingMutation';
import useUpdateOwnershipMutation from '../../../hooks/useUpdateOwnershipMutation';
import useItemModalsContext from '../useItemModalsContext';

import { UPDATE_OWNERSHIP_API } from '../../../constants';

const useItemUpdateOwnership = ({
  item,
  instanceId,
  targetTenant,
  setTargetTenant,
  holdingsSourcesByName,
  calloutContext,
  updateOwnershipData,
  setUpdateOwnershipData,
  onSuccess,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();

  const { mutateHolding } = useHoldingMutation(targetTenant?.id);
  const { updateOwnership } = useUpdateOwnershipMutation(UPDATE_OWNERSHIP_API.ITEMS);
  const {
    setIsUpdateOwnershipModalOpen,
    setIsLinkedLocalOrderLineModalOpen,
    setIsConfirmUpdateOwnershipModalOpen,
  } = useItemModalsContext();

  const onCancelUpdateOwnership = () => {
    setTargetTenant({});
    setUpdateOwnershipData({});
    setIsConfirmUpdateOwnershipModalOpen(false);
  };

  const openUpdateOwnershipModal = () => {
    setIsUpdateOwnershipModalOpen(true);
  };

  const openLinkedOrderLineModal = () => {
    setIsLinkedLocalOrderLineModalOpen(true);
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

    onSuccess();
  };

  const showReferenceDataErrorCallout = () => {
    calloutContext.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.updateOwnership.items.message.error" />,
    });

    onCancelUpdateOwnership();
  };

  const showCommonErrorCallout = () => {
    calloutContext.sendCallout({
      type: 'error',
      message: <FormattedMessage id="ui-inventory.communicationProblem" />,
    });

    onCancelUpdateOwnership();
  };

  const handleUpdateOwnership = useCallback(() => {
    const { purchaseOrderLineIdentifier } = item;

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
  }, [item]);

  const createNewHoldingForLocation = useCallback(async (targetLocation, targetTenantId) => {
    try {
      const newHoldingData = await mutateHolding({
        permanentLocationId: targetLocation.id,
        instanceId,
        sourceId: holdingsSourcesByName.FOLIO.id,
      });

      await updateOwnership({
        toHoldingsRecordId: newHoldingData.id,
        itemIds: [item.id],
        targetTenantId,
      });

      showSuccessMessageAndGoBack(item.hrid);
    } catch (e) {
      showCommonErrorCallout();
    }
  }, [instanceId, holdingsSourcesByName, item]);

  const onConfirmHandleUpdateOwnership = useCallback(async () => {
    const { targetLocation, tenantId, holdingId } = updateOwnershipData;
    const newTenant = stripes.user.user?.tenants?.find(tenant => tenant.id === tenantId);

    if (targetLocation) {
      await createNewHoldingForLocation(targetLocation, newTenant.id);
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
        if (error.response?.status === 400) {
          showReferenceDataErrorCallout();
        } else {
          showCommonErrorCallout();
        }
      }
    }
  }, [stripes.user.user?.tenants, item, updateOwnershipData]);

  return {
    handleUpdateOwnership,
    onConfirmHandleUpdateOwnership,
    onCancelUpdateOwnership,
  };
};

export default useItemUpdateOwnership;
