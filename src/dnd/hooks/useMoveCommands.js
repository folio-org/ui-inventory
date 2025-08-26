import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { uniq } from 'lodash';

import { useStripes } from '@folio/stripes/core';

import HoldingsList from '../../Instance/HoldingsList/HoldingsList';

import {
  useInventoryActions,
  useInventoryState,
} from '../InventoryProvider';
import { useSelection } from '../SelectionProvider';
import { useInventoryAPI } from './useInventoryAPI';
import { useConfirmBridge } from '../ConfirmationBridge';

export const useMoveCommands = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const state = useInventoryState();
  const actions = useInventoryActions();

  const { getSelectedItemsFromHolding, getSelectedHoldingsFromInstance, toggleAllItems, clear } = useSelection();
  const { confirmAndMoveItems, moveHoldings, checkPOLinkage } = useInventoryAPI();
  const { setIsMoveHoldingsModalOpen, setMoveModalMessage, setOnConfirm } = useConfirmBridge();

  // Move currently selected items to a target holding (may span multiple sources)
  const moveSelectedItemsToHolding = async (fromHoldingId, toHoldingId) => {
    const itemsToMove = getSelectedItemsFromHolding(fromHoldingId);

    if (!itemsToMove.length) return;

    const onSuccess = () => {
      actions.moveItems({ itemIds: itemsToMove, toHoldingId });
      toggleAllItems(fromHoldingId, false); // clear selection after success
    };

    // call server for each source holding, then commit to store
    await confirmAndMoveItems({ fromHoldingId, toHoldingId, itemIds: itemsToMove, onSuccess });
  };

  const setConfirmationModalMessage = useCallback((hasLinkedPOLs, holdingsIds, holdingsCount, fromInstanceId, toInstanceId) => {
    let movingMessage;
    if (hasLinkedPOLs) {
      movingMessage = (
        <>
          { intl.formatMessage(
            { id: 'ui-inventory.moveItems.modal.message.hasLinkedPOLsOrHoldings' },
          )}
          <HoldingsList
            instanceId={fromInstanceId}
            tenantId={stripes.okapi?.tenant}
            holdings={Object.values(state.holdings).filter(holding => holdingsIds.some(id => id === holding.id))}
            isItemsMovement={false}
            isHoldingsMovement={false}
            pathToAccordionsState={[]}
          />
        </>
      );
    } else {
      movingMessage = intl.formatMessage(
        { id: 'ui-inventory.moveItems.modal.message.holdings' },
        {
          count: holdingsCount,
          targetName: <b>{state.instances[toInstanceId]?.title}</b>
        }
      );
    }

    setMoveModalMessage(movingMessage);
  }, [state.instances]);

  const openHoldingsMoveConfirmationModal = () => {
    setIsMoveHoldingsModalOpen(true);
  };

  const confirmHoldingsMove = (toInstanceId, toInstanceHrid, finalIds) => async () => {
    const onSuccess = () => {
      for (const id of finalIds) {
        actions.moveHolding({ holdingId: id, toInstanceId });
        clear();
      }
    };

    await moveHoldings({ toInstanceId, toInstanceHrid, holdings: finalIds, onSuccess });
  };

  // Move selected holdings to a target instance
  const moveSelectedHoldingsToInstance = async (holdingId, fromInstanceId, toInstanceId, toInstanceHrid) => {
    const holdingsToMove = getSelectedHoldingsFromInstance(fromInstanceId) || [];
    const holdingIds = holdingId ? [holdingId, ...holdingsToMove] : [...holdingsToMove];
    if (!holdingIds.length) return;

    const { hasLinkedPOLs, poLineHoldingIds } = await checkPOLinkage(holdingIds);
    const finalIds = uniq([...holdingIds, ...poLineHoldingIds]);

    setConfirmationModalMessage(hasLinkedPOLs, finalIds, finalIds.length, fromInstanceId, toInstanceId);
    setOnConfirm(() => confirmHoldingsMove(toInstanceId, toInstanceHrid, finalIds));
    openHoldingsMoveConfirmationModal();
  };

  return { moveSelectedItemsToHolding, moveSelectedHoldingsToInstance };
};
