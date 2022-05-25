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

import { useOkapiKy } from '@folio/stripes-core';

import { ORDERS_API } from '../../constants';
import NewOrderModal from './NewOrderModal';

const NewOrderModalContainer = ({
  onCancel,
  open,
}) => {
  const history = useHistory();
  const ky = useOkapiKy();
  const { id } = useParams();
  const [orderId, setOrderId] = useState();

  const validatePONumber = useCallback(async (poNumber) => {
    if (!poNumber) return null;

    const { purchaseOrders = [] } = await ky.get(ORDERS_API, {
      searchParams: {
        query: `poNumber==${poNumber}`,
        limit: 1,
      },
    }).json();
    const order = purchaseOrders?.[0];

    setOrderId(order?.id);

    return (
      !order
        ? <FormattedMessage id="ui-inventory.newOrder.modal.PONumber.doesNotExist" />
        : null
    );
  }, [ky]);

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
};

export default NewOrderModalContainer;
