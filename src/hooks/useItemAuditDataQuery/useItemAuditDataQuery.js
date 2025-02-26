import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useItemAuditDataQuery = (itemId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item-audit-data' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, itemId],
    queryFn: () => ky.get(`audit-data/inventory/item/${itemId}`).json(),
    enabled: Boolean(itemId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    isLoading,
  };
};

export default useItemAuditDataQuery;
