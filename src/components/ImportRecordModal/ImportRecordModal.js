// See ~/git/folio/stripes/ui-users/src/settings/FeeFinesTable/CopyModal.js
// for an example of a modal containing a form

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  Modal,
  ModalFooter,
  Button,
} from '@folio/stripes/components';

const SelectedRecordsModal = ({
  isOpen,
  currentOclcNumber, // eslint-disable-line no-unused-vars
  onGo,
  onCancel,
}) => {
  const intl = useIntl();

  const renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={() => onGo()}
      >
        <FormattedMessage id="ui-inventory.copycat.import" />
      </Button>
      <Button onClick={onCancel}>
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={isOpen}
      label={intl.formatMessage({ id: 'ui-inventory.singleRecordImport' })}
      dismissible
      size="small"
      footer={renderFooter()}
      onClose={onCancel}
    >
      This is ImportRecordModal.
    </Modal>
  );
};

SelectedRecordsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentOclcNumber: PropTypes.string,
  onGo: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SelectedRecordsModal;
