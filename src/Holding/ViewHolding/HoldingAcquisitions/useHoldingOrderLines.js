import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useHoldingOrderLines = (tenant, id, options = {}) => {
  const ky = useOkapiKy({ tenant });

  const queryKey = ['ui-inventory', 'holding-lines', id, tenant];
  const queryFn = () => ky.get(`orders/holding-summary/${id}`).json();

  const { data, isLoading } = useQuery({ queryKey, queryFn, ...options });

  return {
    isLoading,
    holdingOrderLines: data?.holdingSummaries || [],
  };
};

export default useHoldingOrderLines;
