import {
  useContext,
  useCallback,
  useState,
  useRef,
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

  // Initialize original orders when component mounts
  const initializeOriginalOrders = useCallback(() => {
    const items = state.holdings[holdingId]?.itemIds?.map(id => state.items[id]) || [];
    const originalOrders = new Map();
    items.forEach(item => {
      originalOrders.set(item.id, item.order);
    });
    originalOrdersRef.current = originalOrders;
  }, [state.holdings, state.items, holdingId]);

  // Validate order value
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


  // Handle order change
  const handleOrderChange = useCallback((event, itemId) => {
    const newValue = event.target.value;
    const allItems = state.holdings[holdingId]?.itemIds?.map(id => state.items[id]) || [];

    // Update manual changes first
    setManualOrderChanges(prev => {
      const newManualChanges = new Map(prev);

      if (newValue === originalOrdersRef.current.get(itemId)) {
        // If reverting to original value, remove from manual changes
        newManualChanges.delete(itemId);
      } else {
        // Set the new order for this item in manual changes
        newManualChanges.set(itemId, newValue);
      }

      // Validate the new value with manual changes only
      const errors = validateOrder(newValue, itemId, newManualChanges);
      setValidationErrors(errors);

      return newManualChanges;
    });

    // Update pending changes with auto-adjustment
    setPendingOrderChanges(prev => {
      const newChanges = new Map(prev);

      if (newValue === originalOrdersRef.current.get(itemId)) {
        // If reverting to original value, remove from changes
        newChanges.delete(itemId);
      } else {
        // Set the new order for this item
        newChanges.set(itemId, newValue);

        // Auto-adjust other items
        const numNewOrder = parseInt(newValue, 10);
        if (!Number.isNaN(numNewOrder) && numNewOrder >= 1) {
          allItems.forEach(item => {
            if (item.id === itemId) return;

            const currentItemOrder = parseInt(newChanges.get(item.id) || item.order, 10);

            // If current order is >= new order, increment it
            if (currentItemOrder >= numNewOrder) {
              // newChanges.set(item.id, (currentItemOrder + 1).toString());
              newChanges.set(item.id, (currentItemOrder + 1));
            }
          });
        }
      }

      return newChanges;
    });
  }, [state.holdings, state.items, holdingId, validateOrder]);

  // Apply order changes with validation
  const applyOrderChanges = useCallback(async () => {
    if (pendingOrderChanges.size === 0) return;

    const allItems = state.holdings[holdingId]?.itemIds?.map(id => state.items[id]) || [];
    const errors = new Map();

    // Validate all manual changes first
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

    // Create a map of all items with their new orders
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
    allItems.forEach(item => {
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

    // Prepare items for API update with sequential order numbers
    const finalItemsToUpdate = sortedItems.map((item, index) => ({
      id: item.id,
      _version: item._version,
      // order: (index + 1).toString(),
      order: index + 1,
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
    }
  }, [pendingOrderChanges, state.holdings, state.items, holdingId, validateOrder, updateItems, callout, intl]);

  // Reset changes
  const resetOrderChanges = useCallback(() => {
    setPendingOrderChanges(new Map());
    setManualOrderChanges(new Map());
    setValidationErrors(new Map());
  }, []);

  // Check if there are pending changes
  const hasPendingChanges = pendingOrderChanges.size > 0;

  return {
    handleOrderChange,
    applyOrderChanges,
    resetOrderChanges,
    hasPendingChanges,
    pendingOrderChanges,
    validationErrors,
    initializeOriginalOrders,
  };
};

export default useOrderManagement;
