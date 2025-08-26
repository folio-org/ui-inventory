import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { CalloutContext } from '@folio/stripes/core';

import { useHoldings as useHoldingsProvider } from '../../providers';
import { useHoldingsMove } from './useHoldingsMove';
import { DataContext } from '../../contexts';

export const useHoldings = () => {
  const callout = useContext(CalloutContext);
  const { holdingsById } = useHoldingsProvider();
  const { holdingsSourcesByName } = useContext(DataContext);

  const { moveHoldingsWithChecks: newMoveHoldings, isLoading } = useHoldingsMove({
    onSuccess: (data, variables) => {
      // Show success message
      const message = (
        <FormattedMessage
          id="ui-inventory.moveItems.instance.holdings.success"
          values={{ count: variables.holdingsRecordIds.length }}
        />
      );
      callout.sendCallout({ type: 'success', message });
    },
    onError: (error) => {
      // Show error message
      callout.sendCallout({
        type: 'error',
        message: error.message
      });
    }
  });

  const moveHoldings = (toInstanceId, toInstanceHrid, holdings, externalOnSuccess) => {
    const marcHoldingsIds = holdings.filter((holdingsId) => {
      return holdingsById[holdingsId].sourceId === holdingsSourcesByName.MARC.id;
    });

    return newMoveHoldings({
      toInstanceId,
      holdingsRecordIds: holdings,
      marcHoldingsIds,
      targetInstanceHrid: toInstanceHrid,
      onSuccess: externalOnSuccess,
    });
  };


  return {
    isMoving: isLoading,
    moveHoldings,
  };
};
