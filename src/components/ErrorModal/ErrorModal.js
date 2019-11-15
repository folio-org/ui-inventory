import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const ErrorModal = (props) => {
  const {
    isOpen,
    content,
    label,
    onClose,
  } = props;

  const footer = (
    <ModalFooter>
      <Button
        data-test-error-modal-close-button
        onClick={onClose}
      >
        <FormattedMessage id="ui-inventory.common.close" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      data-test-error-modal
      open={isOpen}
      dismissible
      size="small"
      label={label}
      footer={footer}
      onClose={onClose}
    >
      <div data-test-error-modal-content>
        {content}
      </div>
    </Modal>
  );
};

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
