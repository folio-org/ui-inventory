import {
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { InstanceModalsContext } from '../contexts';

const InstanceModalsProvider = ({ children }) => {
  const [isImportRecordModalOpen, setIsImportRecordModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isShareLocalInstanceModalOpen, setIsShareLocalInstanceModalOpen] = useState(false);
  const [isUnlinkAuthoritiesModalOpen, setIsUnlinkAuthoritiesModalOpen] = useState(false);
  const [isSetForDeletionModalOpen, setIsSetForDeletionModalOpen] = useState(false);
  const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(false);
  const [isFindInstancePluginOpen, setIsFindInstancePluginOpen] = useState(false);
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);
  const [isItemsMovement, setIsItemsMovement] = useState(false);

  const value = {
    isImportRecordModalOpen,
    isNewOrderModalOpen,
    isShareLocalInstanceModalOpen,
    isUnlinkAuthoritiesModalOpen,
    isSetForDeletionModalOpen,
    isShareButtonDisabled,
    isFindInstancePluginOpen,
    isCopyrightModalOpen,
    isItemsMovement,

    setIsImportRecordModalOpen,
    setIsNewOrderModalOpen,
    setIsShareLocalInstanceModalOpen,
    setIsUnlinkAuthoritiesModalOpen,
    setIsSetForDeletionModalOpen,
    setIsShareButtonDisabled,
    setIsFindInstancePluginOpen,
    setIsCopyrightModalOpen,
    setIsItemsMovement,
  };

  return (
    <InstanceModalsContext.Provider value={value}>
      {children}
    </InstanceModalsContext.Provider>
  );
};

InstanceModalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InstanceModalsProvider;
