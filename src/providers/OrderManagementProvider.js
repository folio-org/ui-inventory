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
  }), [lastRegisteredFunctions, registerOrderManagement, getOrderManagement]);

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
