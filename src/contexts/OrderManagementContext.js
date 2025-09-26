import { createContext } from 'react';

const OrderManagementContext = createContext({
  applyOrderChanges: () => {},
  resetOrderChanges: () => {},
  hasPendingChanges: false,
});

export default OrderManagementContext;
