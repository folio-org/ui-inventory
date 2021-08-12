import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { LIMIT_MAX } from '../constants';

const useHoldingItemsQuery = (holdingsRecordId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();
  const queryKey = [namespace, 'items', holdingsRecordId];
  const searchParams = {
    limit: LIMIT_MAX,
    query: `holdingsRecordId==${holdingsRecordId}`,
  };

  const queryFn = () => ky.get('inventory/items', { searchParams }).json();
  const { data, isLoading } = useQuery({ queryKey, queryFn, ...options });

  return {
    isLoading,
    items: data?.items,
  };
};

export default useHoldingItemsQuery;
