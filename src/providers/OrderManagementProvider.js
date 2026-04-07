import {
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { OrderManagementContext } from '../contexts';

const OrderManagementProvider = ({ children }) => {
  const [orderManagementFunctionsMap, setOrderManagementFunctionsMap] = useState(new Map());

  const registerOrderManagement = useCallback((holdingId, functions) => {
    setOrderManagementFunctionsMap(prev => {
      const updated = new Map(prev);
      updated.set(holdingId, functions);
      return updated;
    });
  }, []);

  const getOrderManagement = useCallback((holdingId) => {
    return orderManagementFunctionsMap.get(holdingId) || {
      applyOrderChanges: () => {},
      resetOrderChanges: () => {},
      hasPendingChanges: false,
      updateOriginalOrders: () => {},
      handleDndReorder: () => {},
    };
  }, [orderManagementFunctionsMap]);

  // Apply order changes for all holdings that have pending changes
  const applyAllOrderChanges = useCallback(async () => {
    const allPromises = [];

    // Call applyOrderChanges for all holdings - each function checks internally
    // if there are pending changes, so it's safe to call for all
    for (const functions of orderManagementFunctionsMap.values()) {
      if (functions?.applyOrderChanges) {
        allPromises.push(functions.applyOrderChanges());
      }
    }

    await Promise.all(allPromises);
  }, [orderManagementFunctionsMap]);

  // Check if any holding has pending changes
  const hasAnyPendingChanges = useMemo(() => {
    for (const functions of orderManagementFunctionsMap.values()) {
      if (functions?.hasPendingChanges) {
        return true;
      }
    }
    return false;
  }, [orderManagementFunctionsMap]);

  // Reset changes for all holdings
  const resetAllOrderChanges = useCallback(() => {
    for (const functions of orderManagementFunctionsMap.values()) {
      if (functions?.resetOrderChanges) {
        functions.resetOrderChanges();
      }
    }
  }, [orderManagementFunctionsMap]);

  // For backward compatibility, also provide the last registered functions
  const lastRegisteredFunctions = useMemo(() => {
    const functionsArray = Array.from(orderManagementFunctionsMap.values());
    return functionsArray[functionsArray.length - 1] || {
      applyOrderChanges: () => {},
      resetOrderChanges: () => {},
      hasPendingChanges: false,
      updateOriginalOrders: () => {},
      handleDndReorder: () => {},
    };
  }, [orderManagementFunctionsMap]);

  const value = useMemo(() => ({
    ...lastRegisteredFunctions,
    registerOrderManagement,
    getOrderManagement,
    applyAllOrderChanges,
    hasAnyPendingChanges,
    resetAllOrderChanges,
  }), [lastRegisteredFunctions, registerOrderManagement, getOrderManagement, applyAllOrderChanges, hasAnyPendingChanges, resetAllOrderChanges]);

  return (
    <OrderManagementContext.Provider value={value}>
      {children}
    </OrderManagementContext.Provider>
  );
};

OrderManagementProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrderManagementProvider;
