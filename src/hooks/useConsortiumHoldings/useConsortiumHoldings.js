import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
  useOkapiKy,
} from '@folio/stripes/core';

const useConsortiumHoldings = (instanceId, tenantId) => {
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;
  const centralTenantId = consortium?.centralTenantId;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'search-tenants-holdings-by-instance-id' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, consortium, instanceId, tenantId],
    queryFn: () => ky.get('search/consortium/holdings',
      {
        searchParams: {
          instanceId,
          tenantId,
        },
      }).json(),
    enabled: Boolean(centralTenantId && instanceId && tenantId),
  });

  return {
    holdings: data?.holdings,
    isLoading,
  };
};

export default useConsortiumHoldings;
