import { useInfiniteQuery } from 'react-query';
import { useMemo } from 'react';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useInstanceAuditDataQuery = (instanceId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'instance-audit-data' });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteQuery({
    queryKey: [namespace, instanceId],
    queryFn: ({ pageParam }) => ky.get(`audit-data/inventory/instance/${instanceId}`, {
      searchParams: {
        ...(pageParam && { eventTs: pageParam }),
      }
    }).json(),
    getNextPageParam: (lastPage, allPages) => {
      const totalRecords = lastPage?.totalRecords || 0;
      const totalFetchedItems = allPages.reduce((sum, page) => {
        return sum + (page?.inventoryAuditItems?.length || 0);
      }, 0);

      // if we've fetched all records, return undefined to disable further loading
      if (totalFetchedItems >= totalRecords) {
        return undefined;
      }

      // otherwise, return the timestamp of the last item for the next page
      const items = lastPage?.inventoryAuditItems || [];
      return items.length > 0 ? items[items.length - 1].eventTs : undefined;
    },
    enabled: Boolean(instanceId),
    cacheTime: 0,
  });

  // flatten all pages into a single array
  const flattenedData = useMemo(() => {
    return data?.pages?.flatMap(page => page?.inventoryAuditItems || []) || [];
  }, [data]);
  const totalRecords = data?.pages?.[0]?.totalRecords || 0;

  return {
    data: flattenedData,
    totalRecords,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    ...rest,
  };
};

export default useInstanceAuditDataQuery;
