import {
  useQueries,
  useQuery,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';
import { CQL_FIND_ALL } from '@folio/stripes-inventory-components'

import { isUserInConsortiumMode } from '../../utils';
import {
  LIMIT_MAX,
  OKAPI_TENANT_HEADER,
} from '../../constants';

const useLocationsForTenants = ({ tenantIds = [] }) => {
  const [namespace] = useNamespace();
  const stripes = useStripes();
  const ky = useOkapiKy();

  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const queries = useQueries(tenantIds.map(tenantId => {
    return {
      enabled: Boolean(tenantIds.length && isUserInConsortiumMode(stripes) && !isUserInCentralTenant),
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

  const { data: consolidatedLocations } = useQuery({
    queryKey: [namespace, 'consolidatedLocations'],
    queryFn: () => ky.get('search/consortium/locations').json(),
    enabled: Boolean(isUserInConsortiumMode(stripes) && isUserInCentralTenant),
  });

  const locationsFromAllTenants = isUserInCentralTenant
    ? consolidatedLocations?.locations
    : queries.map(({ data }) => data?.locations).filter(Boolean).flat();

  return {
    data: locationsFromAllTenants || [],
    isLoading: queries.some(({ isFetching }) => isFetching),
  };
};

export default useLocationsForTenants;
