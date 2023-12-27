import { useQueries } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { useConsortiumTenants } from '..';
import { isUserInConsortiumMode } from '../../utils';
import {
  CQL_FIND_ALL,
  LIMIT_MAX,
  OKAPI_TENANT_HEADER,
} from '../../constants';

const useLocationsOfAllTenantsQuery = () => {
  const [namespace] = useNamespace();
  const stripes = useStripes();
  const ky = useOkapiKy();

  const { tenants, isLoading } = useConsortiumTenants();

  const tenantIds = tenants.map(tenant => tenant.id);

  const queries = useQueries(tenantIds.map(tenantId => {
    return {
      enabled: Boolean(!isLoading && isUserInConsortiumMode(stripes)),
      queryKey: [namespace, 'tenant', tenantId],
      queryFn: () => ky.get('locations', {
        searchParams: {
          query: CQL_FIND_ALL,
          limit: LIMIT_MAX,
        },
        hooks: {
          beforeRequest: [
            request => {
              request.headers.set(OKAPI_TENANT_HEADER, tenantId);
            },
          ],
        },
      }).json(),
    };
  }));

  return {
    data: queries.map(({ data }) => data?.locations).filter(Boolean).flat(),
    isLoading: queries.some(({ isFetching }) => isFetching),
  };
};

export default useLocationsOfAllTenantsQuery;
