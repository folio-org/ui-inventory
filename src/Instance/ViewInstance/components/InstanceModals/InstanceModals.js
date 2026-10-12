import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { ConfirmationModal } from '@folio/stripes/components';

import {
  ImportRecordModal,
  NewOrderModal,
  InstancePlugin,
} from '../../../../components';

import { useInstanceModalsContext } from '../../../hooks';

const InstanceModals = ({
  instance,
  canUseSingleRecordImport,
  linkedAuthoritiesLength,
  onConfirmShareLocalInstance,
  onShareLocalInstance,
  onSetForDeletion,
  onImportRecord,
  onMoveToAnotherInstance,
}) => {
  const {
    isFindInstancePluginOpen,
    isImportRecordModalOpen,
    isNewOrderModalOpen,
    isShareLocalInstanceModalOpen,
    isUnlinkAuthoritiesModalOpen,
    isSetForDeletionModalOpen,
    isShareButtonDisabled,

    setIsFindInstancePluginOpen,
    setIsImportRecordModalOpen,
    setIsShareLocalInstanceModalOpen,
    setIsNewOrderModalOpen,
    setIsUnlinkAuthoritiesModalOpen,
    setIsSetForDeletionModalOpen,
    setIsShareButtonDisabled,
  } = useInstanceModalsContext();

  const closeFindInstancePlugin = () => {
    setIsFindInstancePluginOpen(false);
  };

  const closeShareLocalInstanceModal = () => {
    setIsShareLocalInstanceModalOpen(false);
  };

  const closeNewOrderModal = () => {
    setIsNewOrderModalOpen(false);
  };

  const closeUnlinkModal = () => {
    setIsUnlinkAuthoritiesModalOpen(false);
    setIsShareButtonDisabled(false);
  };

  const closeSetForDeletionModal = () => {
    setIsSetForDeletionModalOpen(false);
  };

  const closeImportRecordModal = () => {
    setIsImportRecordModalOpen(false);
  };

  const handleMoveToAnotherInstance = (selectedInstance) => {
    closeFindInstancePlugin();
    onMoveToAnotherInstance(selectedInstance);
  };

  const handleSubmitImportRecordModal = args => {
    setIsImportRecordModalOpen(false);
    onImportRecord(args);
  };

  const handleConfirmShareLocalInstance = () => {
    setIsShareButtonDisabled(true);
    onConfirmShareLocalInstance();
  };

  return (
    <>
      {isFindInstancePluginOpen && (
        <InstancePlugin
          onSelect={handleMoveToAnotherInstance}
          onClose={closeFindInstancePlugin}
          withTrigger={false}
        />
      )}
      {canUseSingleRecordImport && (
        <ImportRecordModal
          isOpen={isImportRecordModalOpen}
          currentExternalIdentifier={undefined}
          handleSubmit={handleSubmitImportRecordModal}
          handleCancel={closeImportRecordModal}
          id={instance.id}
        />
      )}
      <NewOrderModal
        open={isNewOrderModalOpen}
        onCancel={closeNewOrderModal}
      />
      <ConfirmationModal
        open={isShareLocalInstanceModalOpen}
        heading={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.header" />}
        message={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.message" values={{ instanceTitle: instance.title }} />}
        confirmLabel={<FormattedMessage id="ui-inventory.shareLocalInstance.modal.confirmButton" />}
        onCancel={closeShareLocalInstanceModal}
        onConfirm={handleConfirmShareLocalInstance}
        isConfirmButtonDisabled={isShareButtonDisabled}
      />
      <ConfirmationModal
        open={isUnlinkAuthoritiesModalOpen}
        heading={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.header" />}
        message={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.message" values={{ linkedAuthoritiesLength }} />}
        confirmLabel={<FormattedMessage id="ui-inventory.unlinkLocalMarcAuthorities.modal.proceed" />}
        onCancel={closeUnlinkModal}
        onConfirm={onShareLocalInstance}
      />
      <ConfirmationModal
        open={isSetForDeletionModalOpen}
        heading={<FormattedMessage id="ui-inventory.setForDeletion.modal.header" />}
        message={<FormattedMessage id="ui-inventory.setForDeletion.modal.message" values={{ instanceTitle: instance.title }} />}
        confirmLabel={<FormattedMessage id="ui-inventory.confirm" />}
        onCancel={closeSetForDeletionModal}
        onConfirm={onSetForDeletion}
      />
    </>
  );
};

InstanceModals.propTypes = {
  instance: PropTypes.object.isRequired,
  canUseSingleRecordImport: PropTypes.bool,
  linkedAuthoritiesLength: PropTypes.number,
  onConfirmShareLocalInstance: PropTypes.func.isRequired,
  onShareLocalInstance: PropTypes.func.isRequired,
  onSetForDeletion: PropTypes.func.isRequired,
  onImportRecord: PropTypes.func.isRequired,
  onMoveToAnotherInstance: PropTypes.func.isRequired,
};

export default InstanceModals;
