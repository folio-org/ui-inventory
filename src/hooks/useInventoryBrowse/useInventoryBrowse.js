import { useCallback } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  getFiltersCount,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import {
  browseModeOptions,
  BROWSE_RESULTS_COUNT,
  CQL_FIND_ALL,
  FACETS_TO_REQUEST,
  undefinedAsString,
} from '../../constants';
import usePrevious from '../usePrevious';

const regExp = /^((callNumber|subject|name|itemEffectiveShelvingOrder) [<|>])/i;

const PATH_MAP = {
  [browseModeOptions.SUBJECTS]: 'browse/subjects/instances',
  [browseModeOptions.CALL_NUMBERS]: 'browse/call-numbers/instances',
  [browseModeOptions.CONTRIBUTORS]: 'browse/contributors/instances',
};

const INITIAL_SEARCH_PARAMS_MAP = {
  [browseModeOptions.SUBJECTS]: 'subject',
  [browseModeOptions.CALL_NUMBERS]: 'callNumber',
  [browseModeOptions.CONTRIBUTORS]: 'name',
};

const PRECEDING_RECORDS_COUNT = 5;

const getInitialPageQuery = (query, qindex) => {
  return regExp.test(query)
    ? query
    : [
      `${INITIAL_SEARCH_PARAMS_MAP[qindex]}>="${query.replace(/"/g, '')}"`,
      `${INITIAL_SEARCH_PARAMS_MAP[qindex]}<"${query.replace(/"/g, '')}"`
    ].join(' or ');
};

const useInventoryBrowse = ({
  filters = {},
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const buildQuery = makeQueryBuilder(
    CQL_FIND_ALL,
    getInitialPageQuery,
  );

  const normalizedFilters = {
    ...Object.entries(filters).reduce((acc, [key, value]) => ({
      ...acc,
      [FACETS_TO_REQUEST[key] || key]: value,
    }), {}),
    query: filters.query || undefined,
  };

  const {
    qindex,
    query: searchQuery,
    ...otherFilters
  } = normalizedFilters;

  const prevSearchIndex = usePrevious(qindex);

  const hasFilters = getFiltersCount(normalizedFilters) > 0;

  const searchParams = {
    highlightMatch: !!searchQuery && !regExp.test(searchQuery),
    limit: BROWSE_RESULTS_COUNT,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
    query: buildQuery({
      query: searchQuery || undefinedAsString,
      qindex,
      ...otherFilters,
    }),
  };

  const updatePage = useCallback((_askAmount, _index, _firstIndex, direction) => {
    // TODO: implement prev-next pagination
    // eslint-disable-next-line no-console
    console.log('direction', direction);
  }, []);

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, filters, qindex, prevSearchIndex],
    async () => {
      const path = PATH_MAP[qindex];

      return ky.get(path, { searchParams }).json();
    }, {
      enabled: !!qindex && hasFilters,
      keepPreviousData: qindex === prevSearchIndex || hasFilters,
      staleTime: 5 * 60 * 1000,
    },
  );

  return {
    data: data.items || [],
    isFetching,
    isLoading,
    pagination: {
      hasPrevPage: !!data.prev,
      hasNextPage: !!data.next,
      onNeedMoreData: updatePage,
    },
    totalRecords: data.totalRecords,
  };
};

export default useInventoryBrowse;
