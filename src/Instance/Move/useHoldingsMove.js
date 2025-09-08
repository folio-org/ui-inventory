import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useHoldingsMove = (options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [fetchHoldingNamespace] = useNamespace({ key: 'fetch-holding-by-instance-id' });

  const {
    onSuccess,
    onError,
    onSettled,
    invalidateQueries = true,
    ...restOptions
  } = options;

  // Helper function to update MARC holdings HRID
  const updateMarcHoldingsHrid = useCallback(async (marcHoldingsIds, targetInstanceHrid) => {
    const updatePromises = marcHoldingsIds.map(async (marcHoldingsId) => {
      try {
        // Get the MARC record
        const { fields, parsedRecordId, ...data } = await ky.get(
          `records-editor/records?externalId=${marcHoldingsId}`
        ).json();

        // Update the HRID field (tag 004)
        const updatedFields = fields.some(f => f.tag === '004')
          ? fields.map(f => (f.tag === '004' ? { ...f, content: targetInstanceHrid } : f))
          : [...fields];

        // Update the record
        await ky.put(`records-editor/records/${parsedRecordId}`, {
          json: {
            ...data,
            parsedRecordId,
            fields: updatedFields,
            _actionType: 'edit',
          }
        });

        return { success: true, holdingId: marcHoldingsId };
      } catch (error) {
        console.error(`Failed to update MARC holding ${marcHoldingsId}:`, error);
        return { success: false, holdingId: marcHoldingsId, error };
      }
    });

    return Promise.allSettled(updatePromises);
  }, [ky]);

  // Main mutation for moving holdings
  const mutation = useMutation(
    async ({ toInstanceId, holdingsRecordIds, marcHoldingsIds, targetInstanceHrid }) => {
      // First, update MARC holdings if any
      if (marcHoldingsIds?.length && targetInstanceHrid) {
        await updateMarcHoldingsHrid(marcHoldingsIds, targetInstanceHrid);
      }

      // Then move the holdings
      const response = await ky.post('inventory/holdings/move', {
        json: {
          toInstanceId,
          holdingsRecordIds,
        }
      });

      return response.json();
    },
    {
      onSuccess: (data, variables) => {
        const { nonUpdatedIds } = data || {};

        const hasErrors = Boolean(nonUpdatedIds?.length);

        if (hasErrors) {
          // Some holdings failed to move
          const errorMessage = intl.formatMessage(
            { id: 'ui-inventory.moveItems.instance.holdings.error' },
            { holdings: nonUpdatedIds.join(', ') }
          );

          const error = new Error(errorMessage);
          error.data = data;
          error.variables = variables;

          if (onError) {
            onError(error, variables);
          }
        } else if (onSuccess) {
          // All holdings moved successfully
          onSuccess(data, variables);
        }
      },
      onError: (error, variables) => {
        const { holdingsRecordIds } = variables;

        const errorMessage = intl.formatMessage(
          { id: 'ui-inventory.moveItems.instance.holdings.error.server' },
          { holdings: holdingsRecordIds.join(', ') }
        );

        const err = new Error(errorMessage);
        err.type = 'server_error';
        err.cause = error;
        err.variables = variables;

        if (onError) {
          onError(err, variables);
        }
      },
      onSettled: (data, error, variables) => {
        // Invalidate relevant queries to refresh data
        if (invalidateQueries) {
          queryClient.invalidateQueries([fetchHoldingNamespace]);
        }

        if (onSettled) {
          onSettled(data, error, variables);
        }
      },
      ...restOptions,
    }
  );

  // Enhanced move function with better error handling
  const moveHoldings = useCallback(async ({
    toInstanceId,
    holdingsRecordIds,
    marcHoldingsIds = [],
    targetInstanceHrid = null,
    onSuccess: customOnSuccess,
    onError: customOnError
  }) => {
    try {
      const result = await mutation.mutateAsync({
        toInstanceId,
        holdingsRecordIds,
        marcHoldingsIds,
        targetInstanceHrid
      });

      if (customOnSuccess) {
        customOnSuccess(result);
      }

      return result;
    } catch (error) {
      if (customOnError) {
        customOnError(error);
      }
      throw error;
    }
  }, [mutation]);

  return {
    moveHoldings,
    ...mutation,
  };
};

export default useHoldingsMove;
