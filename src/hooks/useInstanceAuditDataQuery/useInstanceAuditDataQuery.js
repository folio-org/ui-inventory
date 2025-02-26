import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useInstanceAuditDataQuery = (instanceId, eventTs) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance-audit-data' });

  // eventTs param is used to load more data
  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, instanceId, eventTs],
    queryFn: () => ky.get(`audit-data/inventory/instance/${instanceId}`, {
      searchParams: {
        ...(eventTs && { eventTs })
      }
    }).json(),
    enabled: Boolean(instanceId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};

export default useInstanceAuditDataQuery;
