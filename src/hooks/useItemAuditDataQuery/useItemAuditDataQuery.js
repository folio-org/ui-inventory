import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useItemAuditDataQuery = (itemId, eventTs) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item-audit-data' });

  // eventTs param is used to load more data
  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, itemId, eventTs],
    queryFn: () => ky.get(`audit-data/inventory/item/${itemId}`, {
      searchParams: {
        ...(eventTs && { eventTs })
      }
    }).json(),
    enabled: Boolean(itemId),
    cacheTime: 0,
  });

  return {
    data: data?.inventoryAuditItems || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};

export default useItemAuditDataQuery;
