import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextField,
} from '@folio/stripes-components';

const NewOrderModal = ({
  handleSubmit,
  onCancel,
  open,
  validatePONumber,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-inventory.newOrder.modal.label' });

  const footer = useMemo(() => (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-inventory.newOrder.modal.create" />
      </Button>
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-inventory.cancel" />
      </Button>
    </ModalFooter>
  ));

  const message = useMemo(() => (
    <>
      <FormattedMessage
        id="ui-inventory.newOrder.modal.message"
        tagName="p"
      />

      <Row>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id="ui-inventory.newOrder.modal.PONumber" />}
            name="poNumber"
            validate={validatePONumber}
          />
          {/* TODO: connect with ui-plugin-find-order when it'll be implemented in Nolana */}
        </Col>
      </Row>
    </>
  ));

  return (
    <Modal
      aria-label={modalLabel}
      id="create-order-from-instance-modal"
      footer={footer}
      label={modalLabel}
      onClose={onCancel}
      open={open}
      size="small"
    >
      {message}
    </Modal>
  );
};

NewOrderModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  validatePONumber: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  subscription: { values: true },
  validateOnBlur: true,
  destroyOnUnregister: true,
})(NewOrderModal);
