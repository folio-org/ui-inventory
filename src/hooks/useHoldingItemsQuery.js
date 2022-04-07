import { useQuery } from 'react-query';
import { omit } from 'lodash';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { LIMIT_MAX } from '../constants';

const useHoldingItemsQuery = (
  holdingsRecordId,
  options = { searchParams: {}, key: 'items' },
) => {
  const ky = useOkapiKy().extend({ timeout: false });
  const [namespace] = useNamespace();
  const queryKey = [namespace, options.key, holdingsRecordId];
  const defaultSearchParams = {
    limit: LIMIT_MAX,
    query: `holdingsRecordId==${holdingsRecordId}`,
  };

  const searchParams = {
    ...defaultSearchParams,
    ...options.searchParams,
  };

  const queryFn = () => ky.get('inventory/items', { searchParams }).json();
  const { data, isLoading, isFetching } = useQuery({ queryKey, queryFn, ...omit(options, ['searchParams']) });

  return {
    isFetching,
    isLoading,
    items: data?.items,
    totalRecords: data?.totalRecords,
  };
};

export default useHoldingItemsQuery;
