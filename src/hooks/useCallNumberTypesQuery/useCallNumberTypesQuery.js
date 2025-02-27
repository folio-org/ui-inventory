import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { CQL_FIND_ALL } from '@folio/stripes-inventory-components';

const DEFAULT_VALUE = [];

export const useCallNumberTypesQuery = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'call-number-types' });

  const { data, isFetching } = useQuery(
    [namespace, tenantId],
    () => ky.get(`call-number-types?limit=2000&query=${CQL_FIND_ALL} sortby name`).json(),
  );

  return {
    callNumberTypes: data?.callNumberTypes || DEFAULT_VALUE,
    isCallNumberTypesLoading: isFetching,
  };
};
