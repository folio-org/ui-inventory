import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Modal, ModalFooter, Row, Col, TextField, Button } from '@folio/stripes/components';

const ImportRecordModal = ({
  isOpen,
  currentOclcNumber, // eslint-disable-line no-unused-vars
  handleSubmit: onSubmit,
  handleCancel,
}) => {
  const intl = useIntl();

  const renderFooter = (submitFunction) => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={() => submitFunction()}
      >
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
            label={intl.formatMessage({ id: 'ui-inventory.singleRecordImport' })}
            dismissible
            size="small"
            footer={renderFooter(handleSubmit)}
            onClose={handleCancel}
          >
            <Row>
              <Col xs="6">External identifier</Col>
              <Col xs="6">
                <Field name="externalIdentifier" component={TextField} placeholder="e.g. OCLC number" />
`              </Col>
            </Row>
          </Modal>
        </form>
      )}
    />
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
