import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
  useOkapiKy,
} from '@folio/stripes/core';

const useConsortiumItems = (instanceId, holdingsRecordId, tenant, { searchParams } = {}) => {
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;
  const centralTenantId = consortium?.centralTenantId;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'search-tenants-items-by-instance-and-holdings-id' });

  const { isLoading, isFetching, data = {} } = useQuery({
    queryKey: [namespace, consortium, instanceId, holdingsRecordId, tenant, searchParams],
    queryFn: () => ky.get('search/consortium/items',
      {
        searchParams: {
          instanceId,
          holdingsRecordId,
          tenantId: tenant,
          ...searchParams,
        },
      }).json(),
    enabled: Boolean(centralTenantId && instanceId && holdingsRecordId && tenant),
  });

  return {
    items: data?.items || [],
    totalRecords: data?.totalRecords,
    isLoading,
    isFetching,
  };
};

export default useConsortiumItems;
