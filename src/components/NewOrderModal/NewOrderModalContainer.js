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

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { useInstance } from '../../common';
import { ORDERS_API } from '../../constants';
import NewOrderModal from './NewOrderModal';

const NewOrderModalContainer = ({
  onCancel,
  open,
}) => {
  const history = useHistory();
  const ky = useOkapiKy();
  const stripes = useStripes();
  const { id } = useParams();
  const { instance } = useInstance(id);
  const [orderId, setOrderId] = useState();

  const validatePONumber = useCallback(async (poNumber) => {
    if (!poNumber) return setOrderId(null);

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
    const instanceTenantId = instance?.tenantId || stripes.okapi.tenant;

    history.push(route, { instanceId: instance?.id, instanceTenantId });
  }, [instance, orderId, stripes.okapi.tenant]);

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
