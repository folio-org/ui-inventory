import {
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { CalloutContext } from '@folio/stripes/core';

import useItemsUpdateMutation from '../useItemsUpdateMutation';
import {
  useInventoryState,
  useInventoryActions,
} from '../../dnd/InventoryProvider';

const parseOrder = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const getOriginalOrder = (itemId, item, originalOrdersRef) => {
  return parseOrder(originalOrdersRef.current.get(itemId) || item?.order, 0);
};

const getCurrentOrder = (item) => {
  return parseOrder(item?.order, 0);
};

const calculateAutoAdjustedOrders = (items, changedItemId, newOrder, originalOrder, originalOrdersRef, excludeItemIds = new Set()) => {
  const adjusted = new Map();
  const numNewOrder = parseOrder(newOrder, 0);

  if (numNewOrder < 1) return adjusted;

  for (const item of items) {
    if (item.id !== changedItemId && !excludeItemIds.has(item.id)) {
      const itemOriginalOrder = getOriginalOrder(item.id, item, originalOrdersRef);

      // If moving item to a higher position (e.g., 3 → 5)
      if (originalOrder < numNewOrder) {
        // Items between original and new position shift left
        if (itemOriginalOrder > originalOrder && itemOriginalOrder <= numNewOrder) {
          adjusted.set(item.id, (itemOriginalOrder - 1).toString());
        }
      }

      // If moving item to a lower position (e.g., 5 → 2)
      if (originalOrder > numNewOrder) {
        // Items between new and original position shift right
        if (itemOriginalOrder >= numNewOrder && itemOriginalOrder < originalOrder) {
          adjusted.set(item.id, (itemOriginalOrder + 1).toString());
        }
      }
    }
  }

  return adjusted;
};

const removeItemsAtOriginalOrder = (changes, items, originalOrdersRef) => {
  const cleaned = new Map(changes);

  for (const item of items) {
    if (cleaned.has(item.id)) {
      const originalOrder = getOriginalOrder(item.id, item, originalOrdersRef);
      const pendingOrder = parseOrder(cleaned.get(item.id), 0);

      if (pendingOrder === originalOrder) {
        cleaned.delete(item.id);
      }
    }
  }

  return cleaned;
};

const useOrderManagement = ({ holdingId, tenantId } = {}) => {
  const intl = useIntl();
  const callout = useContext(CalloutContext);
  const state = useInventoryState();
  const actions = useInventoryActions();
  const { mutateAsync: updateItems } = useItemsUpdateMutation({ tenantId });

  // Track pending order changes
  const [pendingOrderChanges, setPendingOrderChanges] = useState(new Map());
  const [manualOrderChanges, setManualOrderChanges] = useState(new Map());
  const [dndDraggedItems, setDndDraggedItems] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState(new Map());
  const originalOrdersRef = useRef(new Map());

  // Memoize items for this holding to prevent unnecessary re-renders
  // Create a stable key to track when items actually change
  const itemsKey = useMemo(() => {
    const holding = state.holdings[holdingId];
    if (!holding?.itemIds) return '';

    // Create a stable key based on itemIds and their orders
    return holding.itemIds
      .map(id => `${id}:${state.items[id]?.order || ''}:${state.items[id]?._version || ''}`)
      .join('|');
  }, [state.holdings[holdingId]?.itemIds, state.items, holdingId]);

  const items = useMemo(() => {
    const holding = state.holdings[holdingId];
    if (!holding?.itemIds) return [];

    return holding.itemIds.map(id => state.items[id]).filter(Boolean);
  }, [itemsKey]);

  const itemsMap = useMemo(() => {
    return new Map(items.map(item => [item.id, item]));
  }, [items]);

  // Initialize original orders when component mounts
  const initializeOriginalOrders = useCallback((initialItems) => {
    const originalOrders = new Map();

    for (const item of initialItems) {
      originalOrders.set(item.id, item.order);
    }

    originalOrdersRef.current = originalOrders;
  }, []);

  const updateOriginalOrders = useCallback(() => {
    const originalOrders = new Map();

    for (const item of items) {
      originalOrders.set(item.id, item.order);
    }

    originalOrdersRef.current = originalOrders;
  }, [items]);

  const validateOrder = useCallback((value, itemId, currentManualChanges) => {
    const errors = new Map();

    // Check if value is a positive integer
    const numValue = parseOrder(value, -1);
    if (numValue < 1) {
      errors.set(itemId, intl.formatMessage({ id: 'ui-inventory.item.order.validation.positiveNumber' }));
      return errors;
    }

    // Check for duplicates only within manually changed fields
    const manualValues = Array.from(currentManualChanges.values()).map(v => parseOrder(v, -1));
    const duplicateCount = manualValues.filter(v => v === numValue).length;

    if (duplicateCount > 1) {
      errors.set(itemId, intl.formatMessage({ id: 'ui-inventory.item.order.validation.duplicate' }));
    }

    return errors;
  }, [intl]);

  const recalculatePendingChangesOnRevert = useCallback((prevPending, newManualChanges) => {
    const recalculated = new Map();

    // Start with DnD changes (items that are in prevPending but not in manual changes)
    // These are items that were changed via DnD and haven't been manually changed
    // Check their current order in state.items vs original order
    for (const [key] of prevPending) {
      if (!newManualChanges.has(key)) {
        // This is a DnD change, keep it if the item's current order is still different from original
        const item = itemsMap.get(key);

        if (item) {
          const originalOrder = getOriginalOrder(key, item, originalOrdersRef);
          const currentOrder = getCurrentOrder(item);

          if (currentOrder !== originalOrder) {
            recalculated.set(key, currentOrder.toString());
          }
        }
      }
    }

    // Add all manual changes
    for (const [key, value] of newManualChanges) {
      recalculated.set(key, value);
    }

    // Recalculate auto-adjusted items based on remaining manual changes
    const excludeItemIds = new Set(newManualChanges.keys());

    for (const [manualItemId, manualOrder] of newManualChanges) {
      const item = itemsMap.get(manualItemId);
      if (item) {
        const originalOrder = getOriginalOrder(manualItemId, item, originalOrdersRef);
        const adjusted = calculateAutoAdjustedOrders(
          items,
          manualItemId,
          manualOrder,
          originalOrder,
          originalOrdersRef,
          excludeItemIds
        );

        for (const [itemId, order] of adjusted) {
          recalculated.set(itemId, order);
        }
      }
    }

    // Remove any items that are now back to their original order
    return removeItemsAtOriginalOrder(recalculated, items, originalOrdersRef);
  }, []);

  const handleOrderChange = useCallback((event, itemId) => {
    const newValue = event.target.value;
    const isReverting = newValue?.toString() === originalOrdersRef.current.get(itemId)?.toString();

    // Remove from DnD dragged items if manually changed (manual changes override DnD)
    setDndDraggedItems(prev => {
      const updated = new Set(prev);
      updated.delete(itemId);
      return updated;
    });

    // Update manual changes
    setManualOrderChanges(prev => {
      const newManualChanges = new Map(prev);

      if (isReverting) {
        // If reverting to original value, remove from manual changes
        newManualChanges.delete(itemId);
      } else {
        // Set the new order for this item in manual changes
        newManualChanges.set(itemId, newValue);
      }

      // Validate the new value with manual changes only
      const errors = validateOrder(newValue, itemId, newManualChanges);
      setValidationErrors(errors);

      // Update pending changes by preserving existing DnD changes and merging manual changes
      setPendingOrderChanges(prevPending => {
        // If reverting to original, recalculate all pending changes from scratch
        if (isReverting) {
          return recalculatePendingChangesOnRevert(
            prevPending,
            newManualChanges,
          );
        }

        // Not reverting - normal update
        // Start with existing pending changes (includes DnD changes)
        const allChanges = new Map(prevPending);

        // Apply all manual changes (this will override any DnD changes for manually changed items)
        for (const [key, value] of newManualChanges) {
          allChanges.set(key, value);
        }

        // Auto-adjust other items based on the new order
        const item = itemsMap.get(itemId);
        if (item) {
          const originalOrder = getOriginalOrder(itemId, item, originalOrdersRef);
          const adjusted = calculateAutoAdjustedOrders(
            items,
            itemId,
            newValue,
            originalOrder,
            originalOrdersRef,
            new Set([itemId])
          );

          for (const [adjustedItemId, adjustedOrder] of adjusted) {
            allChanges.set(adjustedItemId, adjustedOrder);
          }
        }

        // Remove any items that are now back to their original order
        return removeItemsAtOriginalOrder(allChanges, items, originalOrdersRef);
      });

      return newManualChanges;
    });
  }, [items, itemsMap, validateOrder, recalculatePendingChangesOnRevert]);

  const applyOrderChanges = useCallback(async () => {
    if (pendingOrderChanges.size === 0) return;
    const errors = new Map();

    // Validate all manual changes
    for (const [itemId, newOrder] of manualOrderChanges) {
      const item = state.items[itemId];
      if (item) {
        const validationError = validateOrder(newOrder, itemId, manualOrderChanges);
        if (validationError.size > 0) {
          errors.set(itemId, validationError.get(itemId));
        }
      }
    }

    if (errors.size > 0) {
      return;
    }

    const itemsWithNewOrders = new Map();

    // First, apply all pending changes
    for (const [itemId, newOrder] of pendingOrderChanges) {
      const item = state.items[itemId];
      if (item) {
        itemsWithNewOrders.set(itemId, {
          ...item,
          order: parseOrder(newOrder, item.order),
        });
      }
    }

    // Then, add items that weren't changed with their current order
    for (const item of items) {
      if (!itemsWithNewOrders.has(item.id)) {
        itemsWithNewOrders.set(item.id, {
          ...item,
          order: parseOrder(item.order, 0),
        });
      }
    }

    // Sort all items by their new order values
    const sortedItems = Array.from(itemsWithNewOrders.values())
      .sort((a, b) => a.order - b.order);

    // Prepare items for API update
    const finalItemsToUpdate = sortedItems.map((item) => ({
      id: item.id,
      _version: item._version,
      order: item.order.toString(),
      holdingId: item.holdingId,
    }));

    try {
      await updateItems({ items: finalItemsToUpdate });

      callout.sendCallout({
        type: 'success',
        message: intl.formatMessage({ id: 'ui-inventory.item.order.update.success' }),
      });

      // Clear pending changes and errors
      setPendingOrderChanges(new Map());
      setManualOrderChanges(new Map());
      setDndDraggedItems(new Set());
      setValidationErrors(new Map());
    } catch (error) {
      callout.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-inventory.item.order.update.error' }),
      });

      throw error;
    }
  }, [pendingOrderChanges, manualOrderChanges, items, validateOrder, updateItems, callout, intl, state.items]);

  // Reset changes
  const resetOrderChanges = useCallback(() => {
    setPendingOrderChanges(new Map());
    setManualOrderChanges(new Map());
    setDndDraggedItems(new Set());
    setValidationErrors(new Map());
  }, []);

  // Create a map of items that should show as dirty (manually changed + directly dragged)
  const dirtyItemsMap = useMemo(() => {
    const dirtyMap = new Map();

    // Add manually changed items
    for (const [itemId, order] of manualOrderChanges) {
      dirtyMap.set(itemId, order);
    }

    // Add directly dragged items (only if they have pending changes)
    for (const itemId of dndDraggedItems) {
      if (pendingOrderChanges.has(itemId)) {
        dirtyMap.set(itemId, pendingOrderChanges.get(itemId));
      }
    }

    return dirtyMap;
  }, [manualOrderChanges, dndDraggedItems, pendingOrderChanges]);

  // Handle DnD reordering - updates local state and adds to pending changes
  const handleDndReorder = useCallback((newItemIds, draggedItemIds) => {
    if (!holdingId || !Array.isArray(newItemIds)) return;

    const holding = state.holdings[holdingId];
    if (!holding) return;

    // Track which items were directly dragged (not auto-adjusted)
    const draggedSet = draggedItemIds ? new Set(draggedItemIds) : new Set(newItemIds);

    setDndDraggedItems(prev => {
      const updated = new Set(prev);

      // Remove items that are no longer in the holding
      for (const itemId of prev) {
        if (!newItemIds.includes(itemId)) {
          updated.delete(itemId);
        }
      }

      // Add newly dragged items
      for (const itemId of draggedSet) {
        if (newItemIds.includes(itemId)) {
          updated.add(itemId);
        }
      }

      return updated;
    });

    // Calculate new order values based on position in array
    const itemOrders = {};
    const newPendingChanges = new Map();

    newItemIds.forEach((itemId, index) => {
      const newOrder = index + 1;
      const item = state.items[itemId];

      if (item) {
        const originalOrder = getOriginalOrder(itemId, item, originalOrdersRef);
        itemOrders[itemId] = newOrder;

        // Add to pending changes if order changed from original
        if (newOrder !== originalOrder) {
          newPendingChanges.set(itemId, newOrder.toString());
        } else {
          // If reverting to original, remove from pending changes
          newPendingChanges.delete(itemId);
        }
      }
    });

    // Update item order properties in state
    if (Object.keys(itemOrders).length > 0) {
      actions.updateItemsOrder({ itemOrders });
    }

    // Update pending changes
    setPendingOrderChanges(prev => {
      const updated = new Map(prev);

      // Remove items that are no longer in the holding or reverted to original
      for (const itemId of Array.from(updated.keys())) {
        if (!newItemIds.includes(itemId)) {
          updated.delete(itemId);
        }
      }

      // Add or update pending changes
      for (const [itemId, order] of newPendingChanges) {
        updated.set(itemId, order);
      }

      // Remove items that reverted to original
      for (const itemId of newItemIds) {
        if (!newPendingChanges.has(itemId) && prev.has(itemId)) {
          updated.delete(itemId);
        }
      }

      return updated;
    });

    // Clear manual changes only for items that were directly dragged via DnD
    // DnD is the source of truth for these items, but not for items that were just auto-adjusted
    setManualOrderChanges(prev => {
      const updated = new Map(prev);
      // Only remove items that were actually dragged, not all items in the new order
      for (const itemId of draggedSet) {
        updated.delete(itemId);
      }
      return updated;
    });
  }, [holdingId, state.holdings, state.items, actions]);

  const hasPendingChanges = pendingOrderChanges.size > 0;

  return {
    handleOrderChange,
    applyOrderChanges,
    resetOrderChanges,
    hasPendingChanges,
    pendingOrderChanges,
    manualOrderChanges,
    dirtyItemsMap,
    validationErrors,
    initializeOriginalOrders,
    updateOriginalOrders,
    handleDndReorder,
  };
};

export default useOrderManagement;
