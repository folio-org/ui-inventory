import React, {
  useState,
  useContext,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { CalloutContext } from '@folio/stripes-core';

import { useMoveItemsMutation } from '../../common';
import * as RemoteStorage from '../../RemoteStorageService';

export const useItems = () => {
  const callout = useContext(CalloutContext);

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const [isMoving, setIsMoving] = useState(false);

  const { mutate } = useMoveItemsMutation({
    onMutate: () => setIsMoving(true),
    onSettled:  () => setIsMoving(false),
    onError: error => {
      const { message } = error;
      callout.sendCallout({ type: 'error', message });
    },
    onSuccess: (_, variables) => {
      const message = (
        <FormattedMessage
          id="ui-inventory.moveItems.instance.items.success"
          values={{ count: variables?.itemIds?.length ?? 0 }}
        />
      );

      callout.sendCallout({ type: 'success', message });
    },
  });

  const moveItems = (fromHoldingsId, toHoldingsId, itemIds) => {
    const onSuccess = () => {
      if (checkFromRemoteToNonRemote({ fromHoldingsId, toHoldingsId })) {
        callout.sendCallout({
          timeout: 0,
          type: 'warning',
          message: <RemoteStorage.Warning.ForItems count={itemIds.length} />,
        });
      }
    };

    return mutate({ toHoldingsRecordId: toHoldingsId, itemIds }, { onSuccess });
  };

  return {
    isMoving,
    moveItems,
  };
};

export default useItems;
