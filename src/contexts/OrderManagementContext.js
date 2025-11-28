import { createContext } from 'react';

const OrderManagementContext = createContext({
  applyOrderChanges: () => {},
  resetOrderChanges: () => {},
  hasPendingChanges: false,
  updateOriginalOrders: () => {},
  handleDndReorder: () => {},
  getOrderManagement: () => ({
    applyOrderChanges: () => {},
    resetOrderChanges: () => {},
    hasPendingChanges: false,
    updateOriginalOrders: () => {},
    handleDndReorder: () => {},
  }),
});

export default OrderManagementContext;
