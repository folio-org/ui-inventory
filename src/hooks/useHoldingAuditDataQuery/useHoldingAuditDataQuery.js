import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '@folio/stripes-inventory-components';

const useHoldingAuditDataQuery = (holdingId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holding-audit-data' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, holdingId],
    queryFn: () => ky.get(`audit-data/inventory/holdings/${holdingId}`, { searchParams: { limit: LIMIT_MAX } }).json(),
    enabled: Boolean(holdingId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    isLoading,
  };
};

export default useHoldingAuditDataQuery;
