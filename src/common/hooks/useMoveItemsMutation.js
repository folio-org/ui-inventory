import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  useMutation,
  useQueryClient,
} from 'react-query';
import { useIntl } from 'react-intl';

const useMoveItemsMutation = ({ onError, onSuccess, onSettled, invalidateQueries = true, ...restOptions } = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [fetchItemsPerHoldingNamespace] = useNamespace({ key: 'itemsByHoldingId' });

  const customOptions = {
    onError: (error, variables, ...rest) => {
      const errorMessage = intl.formatMessage(
        { id: 'ui-inventory.moveItems.instance.items.error.server' },
        { items: variables?.itemIds?.join(', ') || '' }
      );

      if (onError) {
        onError({ ...error, message: errorMessage }, variables, ...rest);
      }
    },

    onSuccess: (data, variables, ...rest) => {
      const { nonUpdatedIds } = data || {};

      if (nonUpdatedIds?.length) {
        const errorMessage = intl.formatMessage(
          { id: 'ui-inventory.moveItems.instance.items.error' },
          { items: nonUpdatedIds.join(', ') }
        );

        const partialError = new Error(errorMessage);
        partialError.type = 'partial_success';
        partialError.data = data;

        if (onError) {
          onError(partialError, variables, ...rest);
        }
        return;
      }

      if (onSuccess) {
        onSuccess(data, variables, ...rest);
      }
    },

    onSettled: (data, error, variables) => {
      // Invalidate relevant queries to refresh data
      const updatedHoldingIds = [variables.fromHoldingsId, variables.toHoldingsRecordId].filter(Boolean);

      if (invalidateQueries && !error) {
        updatedHoldingIds.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [fetchItemsPerHoldingNamespace, 'items', query] });
          queryClient.invalidateQueries({ queryKey: [fetchItemsPerHoldingNamespace, 'itemCount', query] });
        });
      }

      if (onSettled) {
        onSettled(data, error, variables);
      }
    },
  };

  return useMutation(
    json => ky.post('inventory/items/move', { json }),
    { ...customOptions, ...restOptions }
  );
};

export default useMoveItemsMutation;
