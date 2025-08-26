import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { CalloutContext } from '@folio/stripes/core';
import { useMoveItemsMutation } from '../../common';
import * as RemoteStorage from '../../RemoteStorageService';

export const useItems = () => {
  const callout = useContext(CalloutContext);

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const { mutateAsync, isLoading } = useMoveItemsMutation({
    onError: (error) => {
      const { message } = error;
      callout.sendCallout({ type: 'error', message });
    },
    onSuccess: (data, variables) => {
      // Handle success - show appropriate message based on remote storage check
      const { itemIds } = variables;

      if (checkFromRemoteToNonRemote({
        fromHoldingsId: variables.fromHoldingsId,
        toHoldingsId: variables.toHoldingsRecordId
      })) {
        callout.sendCallout({
          timeout: 0,
          type: 'success',
          message: (<RemoteStorage.Warning.ForItems count={itemIds.length} />),
        });
      } else {
        const message = (
          <FormattedMessage
            id="ui-inventory.moveItems.instance.items.success"
            values={{ count: itemIds?.length ?? 0 }}
          />
        );

        callout.sendCallout({ type: 'success', message });
      }
    },
  });


  const moveItems = async (fromHoldingsId, toHoldingsId, itemIds, externalOnSuccess) => {
    // Call the mutation with all necessary data
    return mutateAsync(
      {
        toHoldingsRecordId: toHoldingsId,
        itemIds,
        fromHoldingsId // Add this so we can access it in onSuccess
      },
      {
        onSuccess: (data, variables) => {
          if (externalOnSuccess) {
            externalOnSuccess(data, variables);
          }
        }
      }
    );
  };

  return {
    isMoving: isLoading,
    moveItems,
  };
};

export default useItems;
