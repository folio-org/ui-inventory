import {
  useEffect,
  useState,
} from 'react';

import { useQuery } from 'react-query';
import { omit } from 'lodash';

import { useNamespace } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-inventory-components';

import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
} from '../constants';
import { useTenantKy } from '../common';

const useHoldingItemsQuery = (
  holdingsRecordId,
  options = { searchParams: {}, key: 'items', tenantId: null },
) => {
  const [sortBy, setSortBy] = useState(`${DEFAULT_ITEM_TABLE_SORTBY_FIELD}/sort.ascending`);
  const ky = useTenantKy({ tenantId: options.tenantId }).extend({ timeout: false });
  const [namespace] = useNamespace({ key: 'itemsByHoldingId' });

  // sortMap contains not all item table's columns because sorting by some columns
  // is not implemented on BE yet
  const sortMap = {
    'order': 'order/number',
    'barcode': 'barcode',
    'status': 'status.name',
    'copyNumber': 'copyNumber',
    'enumeration': 'enumeration',
    'chronology': 'chronology',
    'volume': 'volume',
    'yearCaption': 'yearCaption',
  };

  useEffect(() => {
    if (options.searchParams?.sortBy) {
      const sortQuery = options.searchParams.sortBy;
      const sortDirection = sortQuery.startsWith('-') ? 'descending' : 'ascending';
      const sortOrder = sortQuery.replace(/^-/, '');
      const newSortBy = sortMap[sortOrder]
        ? `${sortMap[sortOrder]}/sort.${sortDirection}`
        : sortBy;

      setSortBy(newSortBy);
    }
  }, [options.searchParams?.sortBy]);

  const defaultSearchParams = {
    offset: 0,
    limit: LIMIT_MAX,
    query: `holdingsRecordId==${holdingsRecordId} sortby ${sortBy}`,
  };
  const searchParams = {
    ...defaultSearchParams,
    ...omit(options.searchParams, ['sortBy']),
  };

  const queryKey = [namespace, options.key, holdingsRecordId, searchParams.offset, sortBy];
  const queryFn = () => ky.get('inventory/items-by-holdings-id', { searchParams }).json();
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    ...omit(options, ['searchParams']),
  });

  return {
    isFetching,
    isLoading,
    items: data?.items,
    totalRecords: data?.totalRecords,
    refetch,
  };
};

export default useHoldingItemsQuery;
