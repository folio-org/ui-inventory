import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Modal, ModalFooter, TextField, Button } from '@folio/stripes/components';

const ImportRecordModal = ({
  isOpen,
  currentExternalIdentifier, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
}) => {
  const renderFooter = (submitFunction) => (
    <ModalFooter>
      <Button buttonStyle="primary" onClick={() => submitFunction()}>
        <FormattedMessage id="ui-inventory.copycat.import" />
      </Button>
      <Button onClick={handleCancel}>
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            id="import-record-modal"
            open={isOpen}
            label={<FormattedMessage id="ui-inventory.singleRecordImport" />}
            dismissible
            size="small"
            footer={renderFooter(handleSubmit)}
            onClose={handleCancel}
          >
            <Field
              name="externalIdentifier"
              component={TextField}
              label={<FormattedMessage id="ui-inventory.copycat.externalIdentifier" />}
              autoFocus
            />
          </Modal>
        </form>
      )}
    />
  );
};

ImportRecordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentExternalIdentifier: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default ImportRecordModal;
