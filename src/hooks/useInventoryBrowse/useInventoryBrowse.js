import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  buildFilterQuery,
  getFiltersCount,
} from '@folio/stripes-acq-components';

import {
  BROWSE_RESULTS_COUNT,
  FACETS_TO_REQUEST,
  PAGE_DIRECTIONS,
  undefinedAsString,
} from '../../constants';
import usePrevious from '../usePrevious';
import {
  FIVE_MINUTES,
  INITIAL_SEARCH_PARAMS_MAP,
  INIT_PAGE_CONFIG,
  PAGINATION_SEARCH_PARAMS_MAP,
  PATH_MAP,
  PRECEDING_RECORDS_COUNT,
  regExp,
} from './constants';

const isPrevious = (direction) => direction === PAGE_DIRECTIONS.prev;

const getInitialPageQuery = (query, qindex) => {
  return regExp.test(query)
    ? query
    : [
      `${INITIAL_SEARCH_PARAMS_MAP[qindex]}>="${query.replace(/"/g, '\\"')}"`,
      `${INITIAL_SEARCH_PARAMS_MAP[qindex]}<"${query.replace(/"/g, '\\"')}"`
    ].join(' or ');
};

const getUpdatedPageQuery = (direction, anchor) => (_query, qindex) => {
  const param = PAGINATION_SEARCH_PARAMS_MAP[qindex];

  return `${param} ${isPrevious(direction) ? '<' : '>'} "${anchor.replace(/"/g, '\\"')}"`;
};

const useInventoryBrowse = ({
  filters = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const { search } = useLocation();
  const [namespace] = useNamespace();
  const [pageConfig, setPageConfig] = useState();

  useEffect(() => {
    setPageConfig(INIT_PAGE_CONFIG);
  }, [filters]);

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

  const baseSearchParams = {
    highlightMatch: !!searchQuery && !regExp.test(searchQuery),
    limit: BROWSE_RESULTS_COUNT,
    precedingRecordsCount: PRECEDING_RECORDS_COUNT,
  };

  const path = PATH_MAP[qindex];
  const prevSearchIndex = usePrevious(qindex || queryString.parse(search).qindex);
  const hasFilters = getFiltersCount(normalizedFilters) > 0;

  const {
    data = {},
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, filters, qindex, prevSearchIndex, pageConfig],
    async () => {
      const [pageNumber, direction, anchor] = pageConfig;

      const query = buildFilterQuery(
        {
          query: searchQuery || undefinedAsString,
          qindex,
          ...otherFilters,
        },
        pageNumber === 0 ? getInitialPageQuery : getUpdatedPageQuery(direction, anchor),
      );

      return ky.get(path, {
        searchParams: {
          ...baseSearchParams,
          query,
        }
      }).json();
    }, {
      enabled: Boolean(pageConfig && qindex && hasFilters),
      keepPreviousData: qindex === prevSearchIndex || hasFilters,
      staleTime: FIVE_MINUTES,
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
