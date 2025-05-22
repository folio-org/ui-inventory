import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useHoldingQuery = (holdingId, { tenantId = '' } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'holding' });

  const { isLoading, data: holding = {}, refetch, isFetching } = useQuery(
    [namespace, holdingId, tenantId],
    () => ky.get(`holdings-storage/holdings/${holdingId}`).json(),
    { enabled: Boolean(holdingId) },
  );

  return ({
    isLoading,
    isFetching,
    holding,
    refetch,
  });
};

export default useHoldingQuery;
