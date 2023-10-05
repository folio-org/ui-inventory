import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../../common';

import {
  CQL_FIND_ALL,
  LIMIT_MAX,
} from '../../constants';

const useLocationsQuery = ({ tenantId } = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'locations' });

  const query = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: () => ky.get(`locations?limit=${LIMIT_MAX}&query=${CQL_FIND_ALL} sortby name`).json(),
  });

  return ({
    ...query,
    data: query.data?.locations,
  });
};

export default useLocationsQuery;
