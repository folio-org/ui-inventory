import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useAuthoritiesByIdQuery = (authoritiesIds = [], { tenant, enabled = true, onSuccess, onError } = {}) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'authoritiesById' });

  const queryIds = authoritiesIds.join(' or ');

  const query = useQuery(
    {
      queryKey: [namespace, queryIds, tenant],
      queryFn: () => ky.get(`authority-storage/authorities?query=id==(${queryIds})`).json(),
      enabled: enabled && !!queryIds,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data?.authorities);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      }
    }
  );

  return {
    ...query,
    data: query.data?.authorities,
  };
};

export default useAuthoritiesByIdQuery;
