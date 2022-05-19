import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useParams,
} from 'react-router-dom';

import NewOrderModal from './NewOrderModal';

const NewOrderModalContainer = ({
  onCancel,
  open,
  ordersMutator,
}) => {
  const history = useHistory();
  const { id } = useParams();
  const [orderId, setOrderId] = useState();

  const validatePONumber = useCallback(async (poNumber) => {
    if (!poNumber) return null;

    const response = await ordersMutator.GET({ params: {
      query: `poNumber==${poNumber}`,
      limit: 1,
    } });
    const order = response?.[0];

    setOrderId(order?.id);

    return (
      !order
        ? <FormattedMessage id="ui-inventory.newOrder.modal.PONumber.doesNotExist" />
        : null
    );
  }, [ordersMutator]);

  const onSubmit = useCallback(() => {
    const route = orderId ? `/orders/view/${orderId}/po-line/create` : '/orders/create';

    history.push(route, { instanceId: id });
  }, [orderId]);

  return (
    <NewOrderModal
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      validatePONumber={validatePONumber}
    />
  );
};

NewOrderModalContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  ordersMutator: PropTypes.object.isRequired,
};

export default NewOrderModalContainer;
