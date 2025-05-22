import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import useItemModalsContext from '../useItemModalsContext';
import {
  itemStatusesMap,
  NOT_REMOVABLE_ITEM_STATUSES,
} from '../../../constants';

const useItemActions = ({ initialTenantId }) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const {
    setIsCannotDeleteItemModalOpen,
    setCannotDeleteItemModalMessageId,
    setIsConfirmDeleteItemModalOpen,
    setIsItemMissingModalOpen,
    setIsItemWithdrawnModalOpen,
    setSelectedItemStatus,
    setIsSelectedItemStatusModalOpen,
  } = useItemModalsContext();

  const handleEdit = useCallback(
    (e) => {
      if (e) e.preventDefault();

      const tenantFrom = stripes.okapi.tenant;
      const { id, holdingsrecordid, itemid } = params;

      history.push({
        pathname: `/inventory/edit/${id}/${holdingsrecordid}/${itemid}`,
        search: location.search,
        state: {
          tenantFrom,
          initialTenantId,
        }
      });
    }, [],
  );
  const handleCopy = useCallback(
    () => {
      const { itemid, id, holdingsrecordid } = params;
      const tenantFrom = stripes.okapi.tenant;

      history.push({
        pathname: `/inventory/copy/${id}/${holdingsrecordid}/${itemid}`,
        search: location.search,
        state: {
          tenantFrom,
          initialTenantId,
        },
      });
    }, [],
  );
  const handleDelete = useCallback(
    (item, request) => {
      const itemStatus = item?.status?.name;
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
        setIsCannotDeleteItemModalOpen(true);
        setCannotDeleteItemModalMessageId(messageId);
      } else {
        setIsConfirmDeleteItemModalOpen(true);
      }
    }, [],
  );
  const handleMarcAsMissing = () => setIsItemMissingModalOpen(true);
  const handleMarkAsWithdrawn = () => setIsItemWithdrawnModalOpen(true);
  const handleMarkWithStatus = status => {
    setSelectedItemStatus(status);
    setIsSelectedItemStatusModalOpen(true);
  };

  return {
    handleEdit,
    handleCopy,
    handleDelete,
    handleMarcAsMissing,
    handleMarkAsWithdrawn,
    handleMarkWithStatus,
  };
};

export default useItemActions;
