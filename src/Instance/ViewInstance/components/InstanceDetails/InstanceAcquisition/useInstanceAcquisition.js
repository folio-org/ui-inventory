import { useQuery } from 'react-query';
import { flatten, orderBy } from 'lodash';

import { useOkapiKy, useNamespace, useStripes } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-inventory-components';

import { batchRequest } from '../../../../../utils';

const useInstanceAcquisition = (id, tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'instance-acquisition' });
  const stripes = useStripes();

  const { data = [], isLoading } = useQuery(
    [namespace, 'instance-acquisition', id, tenant],
    async () => {
      const { titles = [] } = await ky.get('orders/titles', {
        searchParams: {
          limit: LIMIT_MAX,
          query: `instanceId==${id}`,
        },
      }).json();

      const poLineIds = [...new Set(titles.map(({ poLineId }) => poLineId))];

      const orderLines = await batchRequest(
        async ({ params: searchParams }) => {
          const { poLines = [] } = await ky.get('orders/order-lines', { searchParams }).json();

          return poLines;
        },
        poLineIds,
      );

      const orderIds = [...new Set(orderLines.map(({ purchaseOrderId }) => purchaseOrderId))];

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

      return orderBy(orderLines.map(line => ({ ...line, order: ordersMap[line.purchaseOrderId] })),
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
