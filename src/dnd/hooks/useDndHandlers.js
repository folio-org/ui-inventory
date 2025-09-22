import {
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react';

import { useSelection } from '../SelectionProvider';
import {
  useInventoryActions,
  useInventoryState,
} from '../InventoryProvider';
import useInventoryAPI from './useInventoryAPI';
import { useItemsUpdateMutation } from '../../hooks';
import { useConfirmBridge } from '../ConfirmationBridge';
import * as RemoteStorage from '../../RemoteStorageService';
import useMoveCommands from './useMoveCommands';

const DRAG_TYPES = {
  ITEM: 'ITEM',
  HOLDING: 'HOLDING',
};

const parseInstance = instanceId => {
  // accepts "instance:<holdingId>"
  if (!instanceId || typeof instanceId !== 'string') return null;

  const [kind, id] = instanceId.split(':');

  return kind === 'instance' ? id : null;
};

const parseHoldingItemsId = (holdingId) => {
  // accepts "holding-items:<holdingId>"
  if (!holdingId || typeof holdingId !== 'string') return null;

  const [kind, id] = holdingId.split(':');

  return kind === 'holding-items' ? id : null;
};

const parseHoldings = holdingId => {
  // accepts "holding:<holdingId>"
  if (!holdingId || typeof holdingId !== 'string') return null;

  const [kind, id] = holdingId.split(':');

  return kind === 'holding' ? id : null;
};

const parseItemId = (itemId) => {
  // accepts "item:<itemId>"
  if (!itemId || typeof itemId !== 'string') return null;

  const [kind, id] = itemId.split(':');

  return kind === 'item' ? id : null;
};

const useDndHandlers = () => {
  const state = useInventoryState();
  const actions = useInventoryActions();
  const { confirmation } = useConfirmBridge();
  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();

  const {
    selectedItems,
    setSelectedItems,
    selectedHoldings,
    setSelectedHoldings,
    getSelectedItemsFromHolding,
    getSelectedHoldingsFromInstance,
    clear,
  } = useSelection();
  const { moveItems } = useInventoryAPI();
  const { mutateAsync: updateItems } = useItemsUpdateMutation();
  const {
    moveSelectedItemsToHolding,
    moveSelectedHoldingsToInstance,
  } = useMoveCommands();

  const fromInstanceRef = useRef(null);
  const fromHoldingRef = useRef(null);
  const toHoldingRef = useRef(null);
  const toInstanceRef = useRef(null);
  const draggingItemsRef = useRef(new Set());
  const draggingHoldingsRef = useRef(new Set());
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [activeDragHolding, setActiveDragHolding] = useState(null);

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

  const findContainerForHolding = useCallback((id) => {
    const instanceId = parseInstance(id);

    if (instanceId) return instanceId;

    const holdingId = parseHoldings(id);

    if (holdingId && state.holdings[holdingId]) {
      return state.holdings[holdingId].instanceId;
    }

    return null;
  }, [state.holdings]);

  const findContainerForItem = useCallback((id) => {
    const holdingId = parseHoldingItemsId(id);

    if (holdingId) return holdingId;

    const itemId = parseItemId(id);

    if (itemId && state.items[itemId]) {
      return state.items[itemId].holdingId;
    }

    return null;
  }, [state.items]);

  const handleSingleHoldingDrag = useCallback((holdingId) => {
    setActiveDragHolding(holdingId);

    draggingHoldingsRef.current = new Set([holdingId]);
    setSelectedHoldings(new Set([holdingId]));
  }, [setSelectedHoldings]);

  const handleSingleItemDrag = useCallback((itemId) => {
    setActiveDragItem(itemId);

    draggingItemsRef.current = new Set([itemId]);
    setSelectedItems(new Set([itemId]));
  }, [setSelectedItems]);
  const onDragStart = useCallback(({ active }) => {
    actions.previewStart();
    const a = active?.data?.current;

    if (!a) return;

    if (a.type === DRAG_TYPES.HOLDING) {
      const srcInstanceId = a.instanceId;
      const activeHoldingId = a.holdingId;

      fromInstanceRef.current = srcInstanceId;

      // Check if the dragged holding is already selected
      const isDraggedHoldingSelected = selectedHoldings.has(activeHoldingId);

      if (isDraggedHoldingSelected) {
        // Handle dragging selected holdings from the active instance
        const activeInstanceSelectedHoldingIds = getSelectedHoldingsFromInstance(srcInstanceId);

        if (activeInstanceSelectedHoldingIds.size) {
          // Drag multiple selected holdings from the same instance
          setActiveDragHolding('multiple');

          // assign to selected only holdings from current instance
          setSelectedHoldings(new Set(activeInstanceSelectedHoldingIds));
          draggingHoldingsRef.current = new Set(activeInstanceSelectedHoldingIds);
        } else {
          handleSingleHoldingDrag(activeHoldingId);
        }
      } else {
        handleSingleHoldingDrag(activeHoldingId);
      }

      setActiveDragItem(null);
    }
    if (a.type === DRAG_TYPES.ITEM) {
      const srcHoldingId = a.holdingId;
      const activeItemId = a.itemId;

      fromHoldingRef.current = srcHoldingId;

      // Check if the dragged item is already selected
      const isDraggedItemSelected = selectedItems.has(activeItemId);

      if (isDraggedItemSelected) {
        // Handle dragging selected items from the active holding
        const activeHoldingSelectedItemsIds = getSelectedItemsFromHolding(srcHoldingId);

        if (activeHoldingSelectedItemsIds.size) {
          // Drag multiple selected items from the same holding
          setActiveDragItem('multiple');

          // assign to selected only items from current holding
          setSelectedItems(new Set(activeHoldingSelectedItemsIds));
          draggingItemsRef.current = new Set(activeHoldingSelectedItemsIds);
        } else {
          handleSingleItemDrag(activeItemId);
        }
      } else {
        handleSingleItemDrag(activeItemId);
      }

      setActiveDragHolding(null);
    }
  }, [getSelectedItemsFromHolding, getSelectedHoldingsFromInstance, handleSingleItemDrag, handleSingleHoldingDrag, selectedItems, selectedHoldings]);

  const onDragOver = useCallback(({ active, over }) => {
    const a = active?.data?.current;

    if (a?.type === DRAG_TYPES.HOLDING) {
      const activeInstanceId = findContainerForHolding(active?.id);
      const overInstanceId = findContainerForHolding(over?.id);

      if (!activeInstanceId || !overInstanceId || activeInstanceId === overInstanceId) return;

      toInstanceRef.current = overInstanceId;

      const holdingIds = Array.from(draggingHoldingsRef.current);
      if (!holdingIds.length) return;

      actions.previewMoveHoldings({ holdingIds, toInstanceId: overInstanceId });
    }
    if (a?.type === DRAG_TYPES.ITEM) {
      const activeHoldingId = findContainerForItem(active?.id);
      const overHoldingId = findContainerForItem(over?.id);

      if (!activeHoldingId || !overHoldingId || activeHoldingId === overHoldingId) return;

      toHoldingRef.current = overHoldingId;

      const itemIds = Array.from(draggingItemsRef.current);
      if (!itemIds.length) return;

      actions.previewMoveItems({ itemIds, toHoldingId: overHoldingId });
    }
  }, [actions, findContainerForItem, state.holdings]);

  const onDragEnd = useCallback(async ({ active, over }) => {
    const a = active?.data?.current;

    if (a?.type === DRAG_TYPES.HOLDING) {
      // Handle holdings drag end
      const finalTo = toInstanceRef.current || findContainerForHolding(over?.id);
      const fromInstanceId = fromInstanceRef.current;
      const holdingIds = Array.from(draggingHoldingsRef.current);
      const toInstanceHrid = state.instances[finalTo]?.hrid;

      if (!finalTo || finalTo === fromInstanceId || !holdingIds.length) {
        actions.previewCancel();
        return;
      }

      // In dual-instance mode, show confirmation modal
      if (isDualInstanceMode) {
        try {
          const onSuccess = () => actions.previewCommit();
          const onReject = () => actions.previewCancel();
          await moveSelectedHoldingsToInstance({ holdingIds, fromInstanceId, toInstanceId: finalTo, toInstanceHrid, onSuccess, onReject });
        } catch (error) {
          actions.previewCancel();
        }
      }

      // Reset drag state for holdings
      setActiveDragItem(null);
      setActiveDragHolding(null);
      fromInstanceRef.current = null;
      toInstanceRef.current = null;
    }

    if (a?.type === DRAG_TYPES.ITEM) {
      // Handle items drag end
      const finalTo = toHoldingRef.current || findContainerForItem(over?.id);
      const fromHoldingId = fromHoldingRef.current;
      const itemIds = Array.from(draggingItemsRef.current);

      if (!finalTo || !itemIds.length) {
        actions.previewCancel();
        return;
      }

      if (finalTo === fromHoldingId) {
        // Handle re-ordering items within the same holding (single or multiple)
        const currentItemIds = state.holdings[fromHoldingId]?.itemIds || [];
        const draggedItemIds = Array.from(draggingItemsRef.current);

        const overItemId = over?.id ? parseItemId(over.id) : null;

        const newItemIds = [...currentItemIds];
        const targetIndex = overItemId ? newItemIds.indexOf(overItemId) : newItemIds.length - 1;

        if (targetIndex === -1) {
          actions.previewCancel();
          return;
        }

        // Remove all dragged items from their current positions
        const draggedItems = [];
        draggedItemIds.forEach(itemId => {
          const index = newItemIds.indexOf(itemId);
          if (index !== -1) {
            draggedItems.push(newItemIds.splice(index, 1)[0]);
          }
        });

        // Insert dragged items at the target position
        if (draggedItems.length > 0) {
          // Calculate the correct insert position
          const insertIndex = targetIndex >= newItemIds.length ? newItemIds.length : targetIndex;
          newItemIds.splice(insertIndex, 0, ...draggedItems);

          // Check if the order actually changed
          const orderChanged = JSON.stringify(currentItemIds) !== JSON.stringify(newItemIds);

          if (orderChanged) {
            actions.reorderItems({ holdingId: fromHoldingId, itemIds: newItemIds });

            const itemsToUpdate = newItemIds.map((itemId, index) => {
              const item = state.items[itemId];
              return {
                id: itemId,
                _version: item._version,
                order: index + 1,
                holdingId: item.holdingId,
              };
            });

            try {
              await updateItems({ items: itemsToUpdate });
            } catch {
              actions.previewCancel();
              return;
            }
          }
        }

        // Clear selection and commit preview
        clear();
        actions.previewCommit();

        // Reset drag state for items
        setActiveDragItem(null);
        setActiveDragHolding(null);
        fromHoldingRef.current = null;
        toHoldingRef.current = null;
        return;
      }

      // In single-instance mode, check for remote to non-remote
      if (isSingleInstanceMode) {
        try {
          await moveItems({ fromHoldingId, toHoldingId: finalTo, itemIds });
          actions.previewCommit();
          clear();
        } catch (error) {
          actions.previewCancel();
        }
      } else {
        // In dual-instance mode, show confirmation modal
        try {
          const onSuccess = () => actions.previewCommit();
          const onReject = () => actions.previewCancel();
          await moveSelectedItemsToHolding({ fromHoldingId, toHoldingId: finalTo, itemIds, onSuccess, onReject });
        } catch (error) {
          actions.previewCancel();
        }
      }

      // reset local drag state for items
      setActiveDragItem(null);
      setActiveDragHolding(null);
      fromHoldingRef.current = null;
      toHoldingRef.current = null;
    }
  }, [actions, clear, findContainerForItem, moveItems, state.holdings, state.instances, isDualInstanceMode, isSingleInstanceMode, confirmation, checkFromRemoteToNonRemote]);

  return { onDragStart, onDragOver, onDragEnd, activeDragItem, activeDragHolding };
};

export default useDndHandlers;
