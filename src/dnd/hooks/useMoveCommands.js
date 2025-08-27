import { useCallback } from 'react';
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
import { useInventoryAPI } from './useInventoryAPI';
import { useConfirmBridge } from '../ConfirmationBridge';
import useReferenceData from '../../hooks/useReferenceData';
import { callNumberLabel } from '../../utils';
import * as RemoteStorage from '../../RemoteStorageService';

export const useMoveCommands = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const { locationsById } = useReferenceData();
  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const state = useInventoryState();
  const actions = useInventoryActions();

  const { getSelectedItemsFromHolding, getSelectedHoldingsFromInstance, toggleAllItems, clear } = useSelection();
  const { confirmAndMoveItems, moveHoldings, checkPOLinkage } = useInventoryAPI();
  const { setIsMoveHoldingsModalOpen, setMoveModalMessage, setOnConfirm } = useConfirmBridge();

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

    await confirmAndMoveItems({
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

    if (!itemsToMove.length) return;

    setItemsConfirmationMessage(itemsToMove.length, fromHoldingId, toHoldingId);
    setOnConfirm(() => confirmItemsMove(itemsToMove, fromHoldingId, toHoldingId));
    openConfirmationModal();
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
  const moveSelectedHoldingsToInstance = async (holdingId, fromInstanceId, toInstanceId, toInstanceHrid) => {
    const holdingsToMove = getSelectedHoldingsFromInstance(fromInstanceId) || [];
    const holdingIds = holdingId ? [holdingId, ...holdingsToMove] : [...holdingsToMove];
    if (!holdingIds.length) return;

    const { hasLinkedPOLs, poLineHoldingIds } = await checkPOLinkage(holdingIds);
    const finalIds = uniq([...holdingIds, ...poLineHoldingIds]);

    setHoldingsConfirmationMessage(hasLinkedPOLs, finalIds, finalIds.length, fromInstanceId, toInstanceId);
    setOnConfirm(() => confirmHoldingsMove(toInstanceId, toInstanceHrid, finalIds));
    openConfirmationModal();
  };

  return { moveSelectedItemsToHolding, moveSelectedHoldingsToInstance };
};
