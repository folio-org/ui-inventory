import { useQuery } from 'react-query';
import { flatten, orderBy } from 'lodash';

import { useOkapiKy, useNamespace, useStripes } from '@folio/stripes/core';

import { LIMIT_MAX } from '../../../constants';
import { batchRequest } from '../../../utils';

const useInstanceAcquisition = (id) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance-acquisition' });
  const stripes = useStripes();

  const { data = [], isLoading } = useQuery(
    [namespace, 'instance-acquisition', id],
    async () => {
      const { poLines = [] } = await ky.get('orders/order-lines', {
        searchParams: {
          limit: LIMIT_MAX,
          query: `instanceId==${id}`,
        },
      }).json();

      const orderIds = [...new Set(poLines.map(({ purchaseOrderId }) => purchaseOrderId))];

      const orders = await batchRequest(
        async ({ params: searchParams }) => {
          const { purchaseOrders = [] } = await ky.get('orders/composite-orders', { searchParams }).json();

          return purchaseOrders;
        },
        orderIds,
      );

      const acqUnitIds = [...new Set(flatten(orders.map((o) => o.acqUnitIds || [])))];

      const acqUnits = await batchRequest(
        async ({ params: searchParams }) => {
          const { acquisitionsUnits = [] } = await ky.get('acquisitions-units/units', { searchParams }).json();

          return acquisitionsUnits;
        },
        acqUnitIds,
      );

      const acqUnitsMap = acqUnits.reduce((acc, unit) => ({ ...acc, [unit.id]: unit }), {});
      const hydratedOrders = orders.map(order => {
        const orderAcqUnits = order?.acqUnitIds?.map(unitId => acqUnitsMap[unitId]) || [];

        return ({
          ...order,
          acqUnits: orderAcqUnits,
        });
      });
      const ordersMap = hydratedOrders.reduce((acc, order) => ({ ...acc, [order.id]: order }), {});

      return orderBy(poLines.map(line => ({ ...line, order: ordersMap[line.purchaseOrderId] })),
        ({ order }) => order?.dateOrdered, ['desc']);
    },
    { enabled: stripes.hasInterface('order-lines') &&
      stripes.hasInterface('orders') &&
      stripes.hasInterface('acquisitions-units') &&
      Boolean(id) },
  );

  return {
    isLoading,
    instanceAcquisition: data,
  };
};

export default useInstanceAcquisition;
