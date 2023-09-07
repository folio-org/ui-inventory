import { useQuery } from 'react-query';
import { omit } from 'lodash';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  LIMIT_MAX,
} from '../constants';

const useHoldingItemsQuery = (
  holdingsRecordId,
  options = { searchParams: {}, key: 'items' },
) => {
  const ky = useOkapiKy().extend({ timeout: false });
  const [namespace] = useNamespace();

  const sortMap = {
    'barcode': 'barcode',
    'status': 'status.name',
    'copyNumber': 'copyNumber',
    'loanType': 'temporaryLoanType.name',
    'effectiveLocation': 'effectiveLocation.name',
    'enumeration': 'enumeration',
    'chronology': 'chronology',
    'volume': 'volume',
    'yearCaption': 'yearCaption',
    'materialType': 'materialType.name',
  };
  const sortBy = options.searchParams.sortBy ?? DEFAULT_ITEM_TABLE_SORTBY_FIELD;

  const buildQuery = () => {
    const queryFilterByHoldingsRecordId = `holdingsRecordId==${holdingsRecordId}`;
    const sortDirection = sortBy.startsWith('-') ? 'descending' : 'ascending';
    const sortOrder = sortBy.replace(/^-/, '');
    const sort = sortMap[sortOrder];

    return `${queryFilterByHoldingsRecordId} sortby ${sort}/sort.${sortDirection}`;
  };

  const defaultSearchParams = {
    offset: 0,
    limit: LIMIT_MAX,
    query: buildQuery(),
  };
  const searchParams = {
    ...defaultSearchParams,
    ...omit(options.searchParams, ['sortBy']),
  };

  const queryKey = [namespace, options.key, holdingsRecordId, searchParams.offset, sortBy];
  const queryFn = () => ky.get('inventory/items-by-holdings-id', { searchParams }).json();
  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    ...omit(options, ['searchParams']),
  });

  return {
    isFetching,
    isLoading,
    items: data?.items,
    totalRecords: data?.totalRecords,
  };
};

export default useHoldingItemsQuery;
