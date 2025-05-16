import {
  useState,
  useEffect,
} from 'react';
import { useQuery } from 'react-query';
import isEmpty from 'lodash/isEmpty';

import {
  useOkapiKy,
  useNamespace,
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';

const useItemAcquisition = (id) => {
  const stripes = useStripes();
  const centralTenant = stripes.user.user?.consortium?.centralTenantId;
  const [activeTenant, setActiveTenant] = useState(stripes.okapi.tenant);
  const ky = useOkapiKy({ tenant: activeTenant });
  const namespace = useNamespace();

  const fetchItemAcquisition = async () => {
    const { pieces = [] } = await ky.get('orders/pieces', {
      searchParams: { query: `itemId=${id}` },
    }).json();

    if (!pieces.length) return {};

    const [piece] = pieces;
    let orderLine = {};
    let order = {};
    let vendor = {};
    let finance = {};
    let orderSetting = {};

    try {
      orderLine = await ky.get(`orders/order-lines/${piece.poLineId}`).json();

      if (orderLine) {
        try {
          orderSetting = await ky.get(`orders/acquisition-methods/${orderLine.acquisitionMethod}`).json();
        } catch {
          orderSetting = {};
        }

        try {
          finance = await ky.get(`finance/transactions?query=encumbrance.sourcePoLineId="${orderLine.id}"`).json();
        } catch {
          finance = {};
        }
      }
    } catch {
      return {};
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
      finance,
      orderSetting,
    };
  };

  const { data = {}, isLoading } = useQuery(
    [namespace, 'item-acquisition', id, activeTenant],
    fetchItemAcquisition,
    {
      enabled: stripes.hasInterface('pieces') &&
        stripes.hasInterface('order-lines') &&
        stripes.hasInterface('orders') &&
        stripes.hasInterface('organizations.organizations') &&
        stripes.hasInterface('finance') &&
        stripes.hasInterface('acquisition-methods') &&
        Boolean(id),
    }
  );

  useEffect(() => {
    if (!isLoading && isEmpty(data) && checkIfUserInMemberTenant(stripes)) {
      setActiveTenant(centralTenant);
    }
  }, [isLoading, data]);

  return {
    isLoading,
    itemAcquisition: data,
    isCentralTenantAcquisition: activeTenant === centralTenant,
  };
};

export default useItemAcquisition;
