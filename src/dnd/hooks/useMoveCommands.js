import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { uniq } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import { MessageBanner } from '@folio/stripes/components';

import HoldingsList from '../../Instance/HoldingsList/HoldingsList';
import {
  useInventoryActions,
  useInventoryState,
} from '../InventoryProvider';
import { useSelection } from '../SelectionProvider';
import { useConfirmBridge } from '../ConfirmationBridge';
import useInventoryAPI from './useInventoryAPI';
import useReferenceData from '../../hooks/useReferenceData';
import * as RemoteStorage from '../../RemoteStorageService';

import { callNumberLabel } from '../../utils';

const useMoveCommands = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const { locationsById } = useReferenceData();
  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const state = useInventoryState();
  const actions = useInventoryActions();

  const { getSelectedItemsFromHolding, getSelectedHoldingsFromInstance, toggleAllItems, clear } = useSelection();
  const { moveItems, moveHoldings, checkPOLinkage } = useInventoryAPI();
  const { setIsMoveHoldingsModalOpen, setMoveModalMessage, setOnConfirm, setOnCancel } = useConfirmBridge();

  // Detect if we're in dual-instance mode
  const isDualInstanceMode = useMemo(() => {
    const instanceIds = Object.keys(state.instances || {});
    return instanceIds.length === 2;
  }, [state.instances]);

  // Detect if we're in single-instance mode
  const isSingleInstanceMode = useMemo(() => {
    const instanceIds = Object.keys(state.instances || {});
    return instanceIds.length === 1;
  }, [state.instances]);

  const openConfirmationModal = () => {
    setIsMoveHoldingsModalOpen(true);
  };

  const setItemsConfirmationMessage = useCallback((itemsCount, fromHoldingId, toHoldingId) => {
    const targetHolding = state.holdings[toHoldingId] || {};
    const callNumber = callNumberLabel(targetHolding);
    const labelLocation = targetHolding.permanentLocationId ? locationsById[targetHolding.permanentLocationId]?.name : '';

    const movingMessage = intl.formatMessage(
      { id: 'ui-inventory.moveItems.modal.message.items' },
      {
        count: itemsCount,
        targetName: <b>{`${labelLocation} ${callNumber}`}</b>
      }
    );

    const modalContent = (
      <>
        {movingMessage}
        <MessageBanner
          show={checkFromRemoteToNonRemote({ fromHoldingsId: fromHoldingId, toHoldingsId: toHoldingId })}
          type="warning"
        >
          <RemoteStorage.Confirmation.Message count={itemsCount} />
        </MessageBanner>
      </>
    );

    setMoveModalMessage(modalContent);
  }, [locationsById]);

  const confirmItemsMove = (itemsToMove, fromHoldingId, toHoldingId) => async () => {
    const onSuccess = () => {
      actions.moveItems({ itemIds: itemsToMove, toHoldingId });
      toggleAllItems(fromHoldingId, false); // clear selection after success
    };

    await moveItems({
      fromHoldingId,
      toHoldingId,
      itemIds: itemsToMove,
      withRemoteCheck: false,
      onSuccess,
    });
  };

  // Move currently selected items to a target holding (may span multiple sources)
  const moveSelectedItemsToHolding = async (fromHoldingId, toHoldingId) => {
    const itemsToMove = getSelectedItemsFromHolding(fromHoldingId);

    if (!itemsToMove.size) return;

    // In dual-instance mode, show confirmation modal
    if (isDualInstanceMode) {
      setItemsConfirmationMessage(itemsToMove.size, fromHoldingId, toHoldingId);
      setOnConfirm(() => confirmItemsMove([...itemsToMove], fromHoldingId, toHoldingId));
      openConfirmationModal();
    } else {
      // In single-instance mode, check for remote to non-remote and move directly
      try {
        await moveItems({
          fromHoldingId,
          toHoldingId,
          itemIds: [...itemsToMove],
          withRemoteCheck: true, // This will show the remote storage confirmation if needed
        });
        actions.moveItems({ itemIds: [...itemsToMove], toHoldingId });
        toggleAllItems(fromHoldingId, false); // clear selection after success
      } catch (error) {
        console.error('Failed to move items:', error);
      }
    }
  };

  const setHoldingsConfirmationMessage = useCallback((hasLinkedPOLs, holdingsIds, holdingsCount, fromInstanceId, toInstanceId) => {
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
  const moveSelectedHoldingsToInstance = async (activeHoldingId, fromInstanceId, toInstanceId, toInstanceHrid) => {
    const selectedHoldings = getSelectedHoldingsFromInstance(fromInstanceId);
    const holdingIds = selectedHoldings.add(activeHoldingId);

    if (!holdingIds.size) return;

    // In dual-instance mode, show confirmation modal
    if (isDualInstanceMode) {
      // Check for linked POLs first
      const { hasLinkedPOLs, poLineHoldingIds } = await checkPOLinkage(holdingIds);
      const finalIds = uniq([...holdingIds, ...poLineHoldingIds]);

      setHoldingsConfirmationMessage(hasLinkedPOLs, finalIds, finalIds.length, fromInstanceId, toInstanceId);
      setOnConfirm(() => confirmHoldingsMove(toInstanceId, toInstanceHrid, finalIds));
      openConfirmationModal();
    }
  };

  return { moveSelectedItemsToHolding, moveSelectedHoldingsToInstance };
};

export default useMoveCommands;
