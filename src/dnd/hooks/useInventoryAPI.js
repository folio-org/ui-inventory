import { useCallback } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

import * as Move from '../../Instance/Move';
import * as RemoteStorage from '../../RemoteStorageService';
import { useConfirmBridge } from '../ConfirmationBridge';
import { getPOLineHoldingIds } from '../utils';

const useInventoryAPI = () => {
  const ky = useOkapiKy();

  const { confirmation } = useConfirmBridge();
  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const { moveItems: moveItemsApi, isMoving: isItemsMoving } = Move.useItems();
  const { moveHoldings: moveHoldingsApi, isMoving: isHoldingsMoving } = Move.useHoldings();

  const checkPOLinkage = useCallback(async (holdingIds = []) => {
    if (!holdingIds.length) {
      return { hasLinkedPOLs: false, poLineHoldingIds: [] };
    }

    try {
      const { poLines = [] } = await ky.get(LINES_API, {
        searchParams: {
          query: holdingIds.map(id => `locations=="*${id}*"`).join(' or '),
          limit: LIMIT_MAX,
        }
      }).json();

      return {
        hasLinkedPOLs: poLines.length > 1 || (poLines[0]?.locations?.length > 1),
        poLineHoldingIds: getPOLineHoldingIds(poLines, holdingIds),
      };
    } catch (e) {
      return { hasLinkedPOLs: false, poLineHoldingIds: [] };
    }
  }, [ky]);

  const moveItems = useCallback(async ({ fromHoldingId, toHoldingId, itemIds, withRemoteCheck = true, onReject, onSuccess }) => {
    if (!fromHoldingId || !toHoldingId || fromHoldingId === toHoldingId) return;
    if (!Array.isArray(itemIds) || itemIds.length === 0) return;

    try {
      // remote→non-remote check + confirm
      const check = checkFromRemoteToNonRemote({ fromHoldingsId: fromHoldingId, toHoldingsId: toHoldingId });

      if (withRemoteCheck && check) await confirmation.wait();

      await moveItemsApi(fromHoldingId, toHoldingId, itemIds, onSuccess);
    } catch (e) {
      if (onReject) onReject();

      throw e;
    }
  }, [checkFromRemoteToNonRemote, confirmation, moveItemsApi]);

  const moveHoldings = useCallback(async ({ toInstanceId, toInstanceHrid, holdings, onSuccess, onReject }) => {
    try {
      await moveHoldingsApi(toInstanceId, toInstanceHrid, holdings, onSuccess);
    } catch (e) {
      if (onReject) onReject();

      throw e;
    }
  }, []);

  return {
    moveItems,
    moveHoldings,
    checkPOLinkage,
    isItemsMoving,
    isHoldingsMoving,
  };
};

export default useInventoryAPI;
