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
import { useInventoryState } from '../../dnd/InventoryProvider';

const useOrderManagement = ({ holdingId, tenantId } = {}) => {
  const intl = useIntl();
  const callout = useContext(CalloutContext);
  const state = useInventoryState();
  const { mutateAsync: updateItems } = useItemsUpdateMutation({ tenantId });

  // Track pending order changes
  const [pendingOrderChanges, setPendingOrderChanges] = useState(new Map());
  const [manualOrderChanges, setManualOrderChanges] = useState(new Map());
  const [validationErrors, setValidationErrors] = useState(new Map());
  const originalOrdersRef = useRef(new Map());

  // Memoize items for this holding to prevent unnecessary re-renders
  // Create a stable key to track when items actually change
  const itemsKey = useMemo(() => {
    const holding = state.holdings[holdingId];
    if (!holding?.itemIds) return '';

    // Create a stable key based on itemIds and their orders
    return holding.itemIds
      .map(id => `${id}:${state.items[id]?.order || ''}`)
      .join('|');
  }, [state.holdings[holdingId]?.itemIds, state.items, holdingId]);

  const items = useMemo(() => {
    const holding = state.holdings[holdingId];
    if (!holding?.itemIds) return [];

    return holding.itemIds.map(id => state.items[id]).filter(Boolean);
  }, [itemsKey]);

  // Initialize original orders when component mounts
  const initializeOriginalOrders = useCallback(() => {
    const originalOrders = new Map();
    items.forEach(item => {
      originalOrders.set(item.id, item.order);
    });
    originalOrdersRef.current = originalOrders;
  }, [items]);

  const validateOrder = useCallback((value, itemId, currentManualChanges) => {
    const errors = new Map();

    // Check if value is a positive integer
    const numValue = parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue < 1) {
      errors.set(itemId, intl.formatMessage({ id: 'ui-inventory.item.order.validation.positiveNumber' }));
      return errors;
    }

    // Check for duplicates only within manually changed fields
    const manualValues = Array.from(currentManualChanges.values()).map(v => parseInt(v, 10));
    const duplicateCount = manualValues.filter(v => v === numValue).length;

    if (duplicateCount > 1) {
      errors.set(itemId, intl.formatMessage({ id: 'ui-inventory.item.order.validation.duplicate' }));
    }

    return errors;
  }, [intl]);

  const handleOrderChange = useCallback((event, itemId) => {
    const newValue = event.target.value;

    // Update manual changes and calculate all pending changes
    setManualOrderChanges(prev => {
      const newManualChanges = new Map(prev);

      if (newValue.toString() === originalOrdersRef.current.get(itemId).toString()) {
        // If reverting to original value, remove from manual changes
        newManualChanges.delete(itemId);
      } else {
        // Set the new order for this item in manual changes
        newManualChanges.set(itemId, newValue);
      }

      // Validate the new value with manual changes only
      const errors = validateOrder(newValue, itemId, newManualChanges);
      setValidationErrors(errors);

      // Calculate All Pending Changes
      const allChanges = new Map();

      // Add all manual changes (including the current itemId)
      newManualChanges.forEach((order, id) => {
        allChanges.set(id, order);
      });

      if (newValue === originalOrdersRef.current.get(itemId)) {
        setPendingOrderChanges(allChanges);
        return newManualChanges;
      }

      // Auto-adjust other items based on the new order
      const numNewOrder = parseInt(newValue, 10);
      if (!Number.isNaN(numNewOrder) && numNewOrder >= 1) {
        const currentItem = items.find(item => item.id === itemId);
        const originalOrder = parseInt(originalOrdersRef.current.get(itemId) || currentItem?.order || '0', 10);

        items.forEach(item => {
          if (item.id === itemId) return;

          const itemOriginalOrder = parseInt(originalOrdersRef.current.get(item.id) || item.order, 10);

          // If moving item to a higher position (e.g., 3 → 5)
          if (originalOrder < numNewOrder) {
            // Items between original and new position shift left
            if (itemOriginalOrder > originalOrder && itemOriginalOrder <= numNewOrder) {
              allChanges.set(item.id, (itemOriginalOrder - 1).toString());
            }
          }
          // If moving item to a lower position (e.g., 5 → 2)
          else if (originalOrder > numNewOrder) {
            // Items between new and original position shift right
            if (itemOriginalOrder >= numNewOrder && itemOriginalOrder < originalOrder) {
              allChanges.set(item.id, (itemOriginalOrder + 1).toString());
            }
          }
        });
      }

      setPendingOrderChanges(allChanges);
      return newManualChanges;
    });
  }, [items, validateOrder]);

  const applyOrderChanges = useCallback(async () => {
    if (pendingOrderChanges.size === 0) return;
    const errors = new Map();

    // Validate all manual changes
    for (const [itemId, newOrder] of manualOrderChanges) {
      const item = state.items[itemId];
      if (!item) return;

      const validationError = validateOrder(newOrder, itemId, manualOrderChanges);
      if (validationError.size > 0) {
        errors.set(itemId, validationError.get(itemId));
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
          order: parseInt(newOrder, 10),
        });
      }
    }

    // Then, add items that weren't changed with their current order
    items.forEach(item => {
      if (!itemsWithNewOrders.has(item.id)) {
        itemsWithNewOrders.set(item.id, {
          ...item,
          order: parseInt(item.order, 10),
        });
      }
    });

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

      // Clear pending changes and errors
      setPendingOrderChanges(new Map());
      setManualOrderChanges(new Map());
      setValidationErrors(new Map());
    } catch (error) {
      callout.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-inventory.item.order.update.error' }),
      });

      throw error;
    }
  }, [pendingOrderChanges, manualOrderChanges, items, validateOrder, updateItems, callout, intl]);

  // Reset changes
  const resetOrderChanges = useCallback(() => {
    setPendingOrderChanges(new Map());
    setManualOrderChanges(new Map());
    setValidationErrors(new Map());
  }, []);

  const hasPendingChanges = pendingOrderChanges.size > 0;

  return {
    handleOrderChange,
    applyOrderChanges,
    resetOrderChanges,
    hasPendingChanges,
    pendingOrderChanges,
    manualOrderChanges,
    validationErrors,
    initializeOriginalOrders,
  };
};

export default useOrderManagement;
