import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace, useStripes } from '@folio/stripes/core';

const useItemAcquisition = (id) => {
  const ky = useOkapiKy();
  const namespace = useNamespace();
  const stripes = useStripes();

  const { data = {}, isLoading } = useQuery(
    [namespace, 'item-acquisition', id],
    async () => {
      const { pieces = [] } = await ky.get('orders/pieces', {
        searchParams: { query: `itemId=${id}` },
      }).json();

      if (!pieces.length) return {};

      const [piece] = pieces;
      let orderLine;
      let order;
      let vendor;

      try {
        orderLine = await ky.get(`orders/order-lines/${piece.poLineId}`).json();
      } catch {
        orderLine = {};
      }

      try {
        order = await ky.get(`orders/composite-orders/${orderLine.purchaseOrderId}`).json();
      } catch {
        order = {};
      }

      try {
        vendor = await ky.get(`organizations/organizations/${order.vendor}`).json();
      } catch {
        vendor = {};
      }

      return {
        order,
        orderLine,
        piece,
        vendor,
      };
    },
    { enabled: stripes.hasInterface('pieces') &&
      stripes.hasInterface('order-lines') &&
      stripes.hasInterface('orders') &&
      stripes.hasInterface('organizations.organizations') &&
      Boolean(id) },
  );

  return {
    isLoading,
    itemAcquisition: data,
  };
};

export default useItemAcquisition;
