import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useHoldingAuditDataQuery = (holdingId, eventTs) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holding-audit-data' });

  // eventTs param is used to load more data
  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, holdingId, eventTs],
    queryFn: () => ky.get(`audit-data/inventory/holdings/${holdingId}`, {
      searchParams: {
        ...(eventTs && { eventTs })
      }
    }).json(),
    enabled: Boolean(holdingId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};

export default useHoldingAuditDataQuery;
