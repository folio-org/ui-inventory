import {
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { OrderManagementContext } from '../contexts';

const OrderManagementProvider = ({ children }) => {
  const [orderManagementFunctions, setOrderManagementFunctions] = useState({
    applyOrderChanges: () => {},
    resetOrderChanges: () => {},
    hasPendingChanges: false,
  });

  const registerOrderManagement = useCallback((functions) => {
    setOrderManagementFunctions(functions);
  }, []);

  const value = useMemo(() => ({
    ...orderManagementFunctions,
    registerOrderManagement,
  }), [orderManagementFunctions, registerOrderManagement]);

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
