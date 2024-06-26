import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import useTenantKy from '../useTenantKy';

const useHolding = (holdingId, { tenantId = '' } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'holding' });

  const { isLoading, data: holding = {}, refetch, isFetching } = useQuery(
    [namespace, holdingId],
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

export default useHolding;
