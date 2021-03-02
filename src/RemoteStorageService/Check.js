import { useCallback } from 'react';

import { useRemoteStorageMappings } from '@folio/stripes/smart-components';

import { useHoldings } from '../providers';


export const useByLocation = () => {
  const remoteMap = useRemoteStorageMappings();

  return useCallback(
    ({ fromLocationId, toLocationId }) => (fromLocationId in remoteMap) && !(toLocationId in remoteMap),
    [remoteMap]
  );
};


export const useByHoldings = () => {
  const { holdingsById } = useHoldings();
  const check = useByLocation();

  return useCallback(
    ({ fromHoldingsId, toHoldingsId }) => {
      if (holdingsById === undefined) return false;

      const fromLocationId = holdingsById[fromHoldingsId]?.permanentLocationId;
      const toLocationId = holdingsById[toHoldingsId]?.permanentLocationId;

      return check({ fromLocationId, toLocationId });
    },
    [check, holdingsById]
  );
};
