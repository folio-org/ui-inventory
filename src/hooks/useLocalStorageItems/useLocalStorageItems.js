import {
  useRef,
  useEffect,
} from 'react';

import { useNamespace } from '@folio/stripes/core';

const useLocalStorageItems = holdingId => {
  const [namespace] = useNamespace();
  const storageKey = `${namespace}/items`;

  const itemsDataRef = useRef({});

  useEffect(() => {
    const storedItems = localStorage.getItem(storageKey);
    itemsDataRef.current = storedItems ? JSON.parse(storedItems) : {};
  }, []);

  const addItem = itemId => {
    const holdingItems = itemsDataRef.current[holdingId] || [];

    if (!holdingItems.includes(itemId)) {
      const updatedHoldingItems = [...holdingItems, itemId];
      const updatedItems = { ...itemsDataRef.current, [holdingId]: updatedHoldingItems };
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
      itemsDataRef.current = updatedItems;
    }
  };

  const getItem = (itemId) => {
    return itemsDataRef.current[holdingId]?.find(item => item === itemId);
  };

  return { addItem, getItem };
};

export default useLocalStorageItems;
