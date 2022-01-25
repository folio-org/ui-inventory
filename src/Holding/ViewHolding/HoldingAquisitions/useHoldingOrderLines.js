import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useHoldingOrderLines = (id, options = {}) => {
  const ky = useOkapiKy();

  const queryKey = ['ui-inventory', 'holding-lines', id];
  const queryFn = () => ky.get(`orders/holding-summary/${id}`).json();

  const { data, isLoading } = useQuery({ queryKey, queryFn, ...options });

  return {
    isLoading,
    holdingOrderLines: data?.holdingSummaries || [],
  };
};

export default useHoldingOrderLines;
