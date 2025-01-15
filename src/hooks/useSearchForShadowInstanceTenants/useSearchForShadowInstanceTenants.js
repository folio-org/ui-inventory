import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import { useTenantKy } from '../../common';

const useSearchForShadowInstanceTenants = ({ instanceId } = {}) => {
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;

  const ky = useTenantKy({ tenantId: consortium?.centralTenantId });
  const [namespace] = useNamespace({ key: 'search-instance-by-holdingsTenantId-facet' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, consortium, instanceId],
    queryFn: () => ky.get('search/call-numbers/facets',
      {
        searchParams: {
          facet: 'holdings.tenantId',
          query: `id=${instanceId}`,
        },
      }).json(),
    enabled: Boolean(consortium?.centralTenantId && instanceId),
  });

  return {
    tenants: data?.facets?.['holdings.tenantId']?.values || [],
    isLoading,
  };
};

export default useSearchForShadowInstanceTenants;
