import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useHoldingOrderLines = (tenant, id, options = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'holding-order-lines' });

  const queryKey = [namespace, id, tenant];
  const queryFn = () => ky.get(`orders/holding-summary/${id}`).json();

  const { data, isFetching } = useQuery({ queryKey, queryFn, ...options });

  return {
    isFetching,
    holdingOrderLines: data?.holdingSummaries || [],
  };
};

export default useHoldingOrderLines;
