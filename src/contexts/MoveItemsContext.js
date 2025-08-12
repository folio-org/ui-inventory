import {
  createContext,
  useContext,
} from 'react';

export const MoveItemsContext = createContext();

export const useMoveItemsContext = () => {
  const context = useContext(MoveItemsContext);
  if (!context) {
    throw new Error('useMoveItemsContext must be used within a MoveItemsProvider');
  }
  return context;
};
