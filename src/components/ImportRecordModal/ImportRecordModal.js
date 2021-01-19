import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';

import {
  Modal,
  ModalFooter,
  Button,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';

const ImportRecordModal = ({
  isOpen,
  currentOclcNumber, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
}) => {
  const intl = useIntl();
  // const { values: { externalIdentifier } } = getState();
  // const submitButtonDisabled = !externalIdentifier || submitting;

  const renderFooter = () => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={() => onSubmit()}
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
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>External identifier</Col>
            </Row>
            <Row>
              <Col>
                <Field name="externalIdentifier" component={TextField} placeholder="e.g. OCLC number" />
              </Col>
            </Row>
            <Button type="submit">Import</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </form>
        )}
      />
    </Modal>
  );
};

ImportRecordModal.propTypes = {
  // Client-code provides these
  isOpen: PropTypes.bool.isRequired,
  currentOclcNumber: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default ImportRecordModal;
