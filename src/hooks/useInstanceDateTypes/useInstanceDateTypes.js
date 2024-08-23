import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQL_FIND_ALL,
  LIMIT_MAX,
} from '@folio/stripes-inventory-components';

export const useInstanceDateTypes = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance-date-types' });

  const query = useQuery({
    queryKey: [namespace, 'instance-date-types'],
    queryFn: () => ky.get(`instance-date-types?limit=${LIMIT_MAX}&query=${CQL_FIND_ALL}`).json(),
  });

  return ({
    ...query,
    instanceDateTypes: query.data?.instanceDateTypes || [],
  });
};
