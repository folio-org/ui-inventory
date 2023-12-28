import { useQueries } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { isUserInConsortiumMode } from '../../utils';
import {
  CQL_FIND_ALL,
  LIMIT_MAX,
  OKAPI_TENANT_HEADER,
} from '../../constants';

const useLocationsForTenants = ({ tenantIds = [] }) => {
  const [namespace] = useNamespace();
  const stripes = useStripes();
  const ky = useOkapiKy();

  const queries = useQueries(tenantIds.map(tenantId => {
    return {
      enabled: Boolean(tenantIds.length && isUserInConsortiumMode(stripes)),
      queryKey: [namespace, 'locations', tenantId],
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

  const locationsFromAllTenants = queries.map(({ data }) => data?.locations).filter(Boolean).flat();

  return {
    data: locationsFromAllTenants,
    isLoading: queries.some(({ isFetching }) => isFetching),
  };
};

export default useLocationsForTenants;
