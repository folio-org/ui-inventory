import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { useInventoryAPI } from './useInventoryAPI';
import { useSelection } from '../SelectionProvider';
import {
  useInventoryActions,
  useInventoryState,
} from '../InventoryProvider';

const parseHoldingId = (holdingId) => {
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

export const useDndHandlers = () => {
  const state = useInventoryState();
  const actions = useInventoryActions();

  const { selectedItems, setSelectedItems, clear } = useSelection();
  const { confirmAndMoveItems } = useInventoryAPI();

  const fromHoldingRef = useRef(null);
  const toHoldingRef = useRef(null);
  const draggingItemsRef = useRef(new Set());
  const [activeDragItem, setActiveDragItem] = useState(null);

  const findContainer = useCallback((id) => {
    const holdingId = parseHoldingId(id);

    if (holdingId) return holdingId;

    const itemId = parseItemId(id);

    if (itemId && state.items[itemId]) {
      return state.items[itemId].holdingId;
    }

    return null;
  }, [state.holdings]);

  const getSelectedItemsFromHolding = useCallback((holdingId) => {
    const ids = state.holdings[holdingId]?.itemIds || [];

    return ids.filter(id => selectedItems.has(id));
  }, [state.holdings, selectedItems]);

  const handleSingleItemDrag = useCallback((itemId) => {
    setActiveDragItem(itemId);

    draggingItemsRef.current = new Set([itemId]);
    setSelectedItems(new Set([itemId]));
  }, []);

  const onDragStart = useCallback(({ active }) => {
    actions.previewStart();
    const a = active?.data?.current;

    if (!a) return;

    const srcHoldingId = a.holdingId;
    const activeItemId = a.itemId;

    fromHoldingRef.current = srcHoldingId;

    // Check if the dragged item is already selected
    const isDraggedItemSelected = selectedItems.has(activeItemId);

    if (isDraggedItemSelected) {
      // Handle dragging selected items from the active holding
      const activeHoldingSelectedItemsIds = getSelectedItemsFromHolding(srcHoldingId);

      if (activeHoldingSelectedItemsIds.length) {
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
  }, [getSelectedItemsFromHolding, handleSingleItemDrag, selectedItems]);

  const onDragOver = useCallback(({ active, over }) => {
    const activeHoldingId = findContainer(active?.id);
    const overHoldingId = findContainer(over?.id);

    if (!activeHoldingId || !overHoldingId || activeHoldingId === overHoldingId) return;

    toHoldingRef.current = overHoldingId;

    const itemIds = Array.from(draggingItemsRef.current);
    if (!itemIds.length) return;

    actions.previewMoveItems({ itemIds, toHoldingId: overHoldingId });
  }, [actions, findContainer, state.holdings]);

  const onDragEnd = useCallback(async ({ over }) => {
    const finalTo = toHoldingRef.current || findContainer(over?.id);
    const fromHoldingId = fromHoldingRef.current;
    const itemIds = Array.from(draggingItemsRef.current);

    if (!finalTo || finalTo === fromHoldingId || !itemIds.length) {
      actions.previewCancel();
      return;
    }

    const onReject = () => {
      actions.previewCancel();
    };

    const onSuccess = () => {
      draggingItemsRef.current = new Set();
      setSelectedItems(new Set());
    };

    try {
      await confirmAndMoveItems({ fromHoldingId, toHoldingId: finalTo, itemIds, onReject, onSuccess });

      actions.previewCommit();
      clear();
    } catch (e) {
      onReject();
    }

    // reset local drag state
    setActiveDragItem(null);
    fromHoldingRef.current = null;
    toHoldingRef.current = null;
  }, [actions, clear, findContainer, confirmAndMoveItems, state.holdings]);

  return { onDragStart, onDragOver, onDragEnd, activeDragItem };
};
