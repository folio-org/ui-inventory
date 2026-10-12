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
  applyAllOrderChanges: async () => {},
  hasAnyPendingChanges: false,
  resetAllOrderChanges: () => {},
});

export default OrderManagementContext;
