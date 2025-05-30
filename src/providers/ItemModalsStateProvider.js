import {
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { ItemModalsContext } from '../contexts';

const ItemModalsStateProvider = ({ children }) => {
  const [isItemMissingModalOpen, setIsItemMissingModalOpen] = useState(false);
  const [isItemWithdrawnModalOpen, setIsItemWithdrawnModalOpen] = useState(false);
  const [isConfirmDeleteItemModalOpen, setIsConfirmDeleteItemModalOpen] = useState(false);
  const [isCannotDeleteItemModalOpen, setIsCannotDeleteItemModalOpen] = useState(false);
  const [isUpdateOwnershipModalOpen, setIsUpdateOwnershipModalOpen] = useState(false);
  const [isConfirmUpdateOwnershipModalOpen, setIsConfirmUpdateOwnershipModalOpen] = useState(false);
  const [cannotDeleteItemModalMessageId, setCannotDeleteItemModalMessageId] = useState('');
  const [isLinkedLocalOrderLineModalOpen, setIsLinkedLocalOrderLineModalOpen] = useState(false);
  const [isSelectedItemStatusModalOpen, setIsSelectedItemStatusModalOpen] = useState(false);
  const [selectedItemStatus, setSelectedItemStatus] = useState('');

  const value = useMemo(() => ({
    isItemMissingModalOpen,
    isItemWithdrawnModalOpen,
    isConfirmDeleteItemModalOpen,
    isCannotDeleteItemModalOpen,
    isUpdateOwnershipModalOpen,
    isConfirmUpdateOwnershipModalOpen,
    cannotDeleteItemModalMessageId,
    isLinkedLocalOrderLineModalOpen,
    isSelectedItemStatusModalOpen,
    selectedItemStatus,

    setIsItemMissingModalOpen,
    setIsItemWithdrawnModalOpen,
    setIsConfirmDeleteItemModalOpen,
    setIsCannotDeleteItemModalOpen,
    setIsUpdateOwnershipModalOpen,
    setIsConfirmUpdateOwnershipModalOpen,
    setCannotDeleteItemModalMessageId,
    setIsLinkedLocalOrderLineModalOpen,
    setIsSelectedItemStatusModalOpen,
    setSelectedItemStatus,
  }), [
    isItemMissingModalOpen,
    isItemWithdrawnModalOpen,
    isConfirmDeleteItemModalOpen,
    isCannotDeleteItemModalOpen,
    isUpdateOwnershipModalOpen,
    isConfirmUpdateOwnershipModalOpen,
    cannotDeleteItemModalMessageId,
    isLinkedLocalOrderLineModalOpen,
    isSelectedItemStatusModalOpen,
    selectedItemStatus,
  ]);

  return (
    <ItemModalsContext.Provider value={value}>
      {children}
    </ItemModalsContext.Provider>
  );
};

ItemModalsStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ItemModalsStateProvider;
