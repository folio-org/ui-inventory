import {
  useCallback,
  useRef,
} from 'react';
import { useQuery } from 'react-query';
import noop from 'lodash/noop';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  buildFilterQuery,
  getFiltersCount,
} from '@folio/stripes-acq-components';
import { FACETS_TO_REQUEST } from '@folio/stripes-inventory-components';

import {
  BROWSE_RESULTS_COUNT,
  INDEXES_WITH_CALL_NUMBER_TYPE_PARAM,
  PAGE_DIRECTIONS,
  undefinedAsString,
} from '../../constants';
import {
  INITIAL_SEARCH_PARAMS_MAP,
  NEW_INITIAL_SEARCH_PARAMS_MAP,
  PAGINATION_SEARCH_PARAMS_MAP,
  NEW_PAGINATION_SEARCH_PARAMS_MAP,
  PATH_MAP,
  NEW_PATH_MAP,
  PRECEDING_RECORDS_COUNT,
  regExp,
  newRegExp,
} from './constants';

const isPrevious = (direction) => direction === PAGE_DIRECTIONS.prev;

const getInitialPageQuery = (regex, initialSearchParams) => (query, qindex) => {
  return regex.test(query)
    ? query
    : [
      `${initialSearchParams[qindex]}>="${query.replace(/"/g, '\\"')}"`,
      `${initialSearchParams[qindex]}<"${query.replace(/"/g, '\\"')}"`
    ].join(' or ');
};

const getUpdatedPageQuery = (direction, anchor, paginationSearchParams) => (_query, qindex) => {
  const param = paginationSearchParams[qindex];

  return `${param} ${isPrevious(direction) ? '<' : '>'} "${anchor.replace(/"/g, '\\"')}"`;
};

const useInventoryBrowse = ({
  filters = {},
  pageParams = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace();
  const prevSearchIndex = useRef();
  const { pageConfig = [], setPageConfig = noop } = pageParams;

  let regex = regExp;
  let endpoints = PATH_MAP;
  let initialSearchParams = INITIAL_SEARCH_PARAMS_MAP;
  let paginationSearchParams = PAGINATION_SEARCH_PARAMS_MAP;

  if (stripes.hasInterface('browse', '1.5')) {
    regex = newRegExp;
    endpoints = NEW_PATH_MAP;
    initialSearchParams = NEW_INITIAL_SEARCH_PARAMS_MAP;
    paginationSearchParams = NEW_PAGINATION_SEARCH_PARAMS_MAP;
  }

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

  const shouldAddCallNumberType = filters.query && INDEXES_WITH_CALL_NUMBER_TYPE_PARAM.includes(filters.qindex);

  const baseSearchParams = {
    highlightMatch: !!searchQuery && !regex.test(searchQuery),
    limit: BROWSE_RESULTS_COUNT,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
    ...(shouldAddCallNumberType && { callNumberType: qindex }),
  };

  const path = endpoints[qindex];
  const hasFilters = getFiltersCount(otherFilters) > 0;
  const hasSearchParameters = getFiltersCount(filters) > 0;

  const {
    data = {},
    isFetched,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, filters, qindex, pageConfig],
    async () => {
      if (!hasSearchParameters) return {};

      const [pageNumber, direction, anchor] = pageConfig;

      const query = buildFilterQuery(
        {
          query: searchQuery || undefinedAsString,
          qindex,
          ...otherFilters,
        },
        pageNumber === 0
          ? getInitialPageQuery(regex, initialSearchParams)
          : getUpdatedPageQuery(direction, anchor, paginationSearchParams),
        undefined,
        false,
      );

      prevSearchIndex.current = qindex;

      return ky.get(path, {
        searchParams: {
          ...baseSearchParams,
          query,
        }
      }).json();
    }, {
      enabled: Boolean(pageConfig && qindex),
      keepPreviousData: qindex === prevSearchIndex || hasFilters,
      staleTime: 0,
      ...options,
    },
  );

  const updatePage = useCallback((_askAmount, _index, _firstIndex, direction) => {
    const isPrev = isPrevious(direction);
    const anchor = data[isPrev ? 'prev' : 'next'];
    const delta = isPrev ? -1 : 1;

    setPageConfig(([pageNumber]) => [pageNumber + delta, direction, anchor]);
  }, [normalizedFilters, setPageConfig]);

  return {
    data: data.items,
    isFetched,
    isFetching,
    isLoading,
    pagination: {
      hasPrevPage: !!data.prev,
      hasNextPage: !!data.next,
      onNeedMoreData: updatePage,
      pageConfig,
    },
    totalRecords: data.totalRecords,
  };
};

export default useInventoryBrowse;
