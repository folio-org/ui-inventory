import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import * as Move from '../../Instance/Move';

import { useSelection } from '../SelectionProvider';
import { useConfirmationModal } from '../../common';

const ConfirmCtx = createContext(null);

const ConfirmationBridgeProvider = ({ children }) => {
  const confirmation = useConfirmationModal();

  const [isMoveHoldingsModalOpen, setIsMoveHoldingsModalOpen] = useState(false);
  const [moveModalMessage, setMoveModalMessage] = useState(null);
  const [onConfirm, setOnConfirm] = useState(null);
  const [onCancel, setOnCancel] = useState(null);
  const { selectedItems } = useSelection();

  const handleCancel = useCallback(() => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    setIsMoveHoldingsModalOpen(false);
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    setIsMoveHoldingsModalOpen(false);
  }, [onConfirm]);

  return (
    <ConfirmCtx.Provider value={{
      confirmation,
      isMoveHoldingsModalOpen,
      setIsMoveHoldingsModalOpen,
      setMoveModalMessage,
      setOnConfirm,
      setOnCancel,
    }}
    >
      {children}
      <Move.ConfirmationModal
        id="move-holding-confirmation"
        message={moveModalMessage}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        open={isMoveHoldingsModalOpen}
      />
      <Move.ItemsConfirmation
        count={selectedItems.size}
        {...confirmation.props}
      />
    </ConfirmCtx.Provider>
  );
};

export default ConfirmationBridgeProvider;

export const useConfirmBridge = () => {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error('useConfirmBridge must be used within ConfirmationBridgeProvider');
  return ctx;
};
