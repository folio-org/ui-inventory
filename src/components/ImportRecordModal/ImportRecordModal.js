// See ~/git/folio/stripes/ui-users/src/components/Accounts/Actions/CancellationModal.js
// for an example of a modal using final-form

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import setFieldData from 'final-form-set-field-data';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  Modal,
  ModalFooter,
  TextField,
  Button,
  Row,
  Col,
} from '@folio/stripes/components';

import css from './modal.css';

const ImportRecordModal = ({
  isOpen,
  currentOclcNumber, // eslint-disable-line no-unused-vars
  handleSubmit,
  handleCancel,
  submitting,
  // form: { getState },
}) => {
  const intl = useIntl();
  // const { values: { externalIdentifier } } = getState();
  // const submitButtonDisabled = !externalIdentifier || submitting;

  const renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={() => handleSubmit()}
      >
        <FormattedMessage id="ui-inventory.copycat.import" />
      </Button>
      <Button onClick={handleCancel}>
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      id="import-record-modal"
      open={isOpen}
      label={intl.formatMessage({ id: 'ui-inventory.singleRecordImport' })}
      dismissible
      size="small"
      footer={renderFooter()}
      onClose={handleCancel}
    >
      Hello
    </Modal>
  );
};

ImportRecordModal.propTypes = {
  // Client-code provides these
  isOpen: PropTypes.bool.isRequired,
  currentOclcNumber: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  // The final-form HOC provides these
  form: PropTypes.object.isRequired,
  submitting: PropTypes.bool,

};

export default stripesFinalForm({
  subscription: { values: true },
  mutators: { setFieldData }
})(ImportRecordModal);
