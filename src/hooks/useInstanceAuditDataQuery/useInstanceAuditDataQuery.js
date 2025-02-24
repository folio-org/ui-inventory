import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '@folio/stripes-inventory-components';

const useInstanceAuditDataQuery = (instanceId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance-audit-data' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, instanceId],
    queryFn: () => ky.get(`audit-data/inventory/instance/${instanceId}`, { searchParams: { limit: LIMIT_MAX } }).json(),
    enabled: Boolean(instanceId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    isLoading,
  };
};

export default useInstanceAuditDataQuery;
