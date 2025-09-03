import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { useInventoryState } from '../InventoryProvider';

const SelectionContext = createContext(null);

const SelectionProvider = ({ children }) => {
  const state = useInventoryState();
  const [selectedItems, setSelectedItems] = useState(() => new Set());
  const [selectedHoldings, setSelectedHoldings] = useState(() => new Set());

  // Function to handle item selection
  const toggleItem = useCallback((itemId) => {
    setSelectedItems(prev => {
      const next = new Set(prev);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  }, []);

  // Function to handle all items selection
  const toggleAllItems = useCallback((holdingId, checked) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      const itemIds = state.holdings[holdingId]?.itemIds || [];

      if (checked) {
        // Add all items from this holding if they're not already selected
        itemIds.forEach(item => newSelected.add(item));
      } else {
        // Remove all items from this holding
        itemIds.forEach(id => newSelected.delete(id));

        // uncheck holding if selected
        setSelectedHoldings(prevHold => {
          const next = new Set(prevHold);
          next.delete(holdingId);
          return next;
        });
      }

      return newSelected;
    });
  }, [state.holdings]);

  const toggleHolding = useCallback((holdingId, checked) => {
    setSelectedHoldings(prevHoldings => {
      const nextHoldings = new Set(prevHoldings);

      if (checked) {
        nextHoldings.add(holdingId);
      } else {
        nextHoldings.delete(holdingId);
      }

      return nextHoldings;
    });
  }, [state.holdings]);

  // Function to check if items are selected
  const isItemsDragSelected = useCallback((itemsId) => {
    return itemsId?.every(id => selectedItems.has(id));
  }, [selectedItems]);

  // Function to check if holding is selected
  const isHoldingDragSelected = useCallback((holdingId) => {
    return selectedHoldings.has(holdingId);
  }, [selectedHoldings]);

  // Helper function to get selected items from a specific holding
  const getSelectedItemsFromHolding = useCallback((holdingId) => {
    const ids = state.holdings[holdingId]?.itemIds || [];

    return new Set(ids.filter(id => selectedItems.has(id)));
  }, [selectedItems, state.holdings]);

  // Helper function to get selected holdings from a specific instance
  const getSelectedHoldingsFromInstance = useCallback((instanceId) => {
    const ids = state.instances[instanceId]?.holdingIds || [];

    return new Set(ids.filter(id => selectedHoldings.has(id)));
  }, [selectedHoldings, state.instances]);

  const clear = useCallback(() => {
    setSelectedItems(new Set());
    setSelectedHoldings(new Set());
  }, []);

  const value = {
    selectedItems,
    selectedHoldings,
    toggleItem,
    toggleHolding,
    toggleAllItems,
    setSelectedItems,
    setSelectedHoldings,

    getSelectedItemsFromHolding,
    getSelectedHoldingsFromInstance,
    isItemsDragSelected,
    isHoldingDragSelected,
    clear,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export default SelectionProvider;

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
};
