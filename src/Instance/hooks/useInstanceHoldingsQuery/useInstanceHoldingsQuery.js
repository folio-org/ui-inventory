import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-inventory-components';

const useInstanceHoldingsQuery = (instanceId, tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'instance-holdings-records' });

  const { isLoading, data } = useQuery(
    [namespace, instanceId, tenant],
    () => ky.get('holdings-storage/holdings', {
      searchParams: {
        limit: LIMIT_MAX,
        query: `instanceId==${instanceId} sortBy effectiveLocation.name callNumberPrefix callNumber callNumberSuffix`,
      },
    }).json(),
    { enabled: Boolean(instanceId) },
  );

  return ({
    isLoading,
    holdingsRecords: data?.holdingsRecords || [],
    totalRecords: data?.totalRecords || 0,
  });
};

export default useInstanceHoldingsQuery;
