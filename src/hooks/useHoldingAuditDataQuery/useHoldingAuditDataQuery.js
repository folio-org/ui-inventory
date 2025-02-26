import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useHoldingAuditDataQuery = (holdingId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holding-audit-data' });

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, holdingId],
    queryFn: () => ky.get(`audit-data/inventory/holdings/${holdingId}`).json(),
    enabled: Boolean(holdingId),
  });

  return {
    data: data?.inventoryAuditItems || [],
    isLoading,
  };
};

export default useHoldingAuditDataQuery;
