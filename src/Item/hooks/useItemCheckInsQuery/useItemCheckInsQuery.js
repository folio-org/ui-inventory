import { useState } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const LIMIT = 100;

const useItemCheckInsQuery = (itemId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'item-check-ins' });
  const [offset, setOffset] = useState(0);

  const { isLoading, data = {}, isFetching } = useQuery(
    [namespace, itemId, offset],
    () => ky.get('circulation/check-ins', {
      searchParams: {
        query: `itemId==${itemId} sortby occurredDateTime/sort.descending`,
        limit: LIMIT,
        offset,
      },
    }).json(),
    { enabled: Boolean(itemId) },
  );

  return {
    isLoading,
    isFetching,
    checkIns: data.checkIns || [],
    totalRecords: data.totalRecords || 0,
    offset,
    setOffset,
    limit: LIMIT,
  };
};

export default useItemCheckInsQuery;
