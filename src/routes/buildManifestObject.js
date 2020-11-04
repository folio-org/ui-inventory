import { get } from 'lodash';

import { makeQueryFunction } from '@folio/stripes/smart-components';
import { CQL_FIND_ALL } from '../constants';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../utils';
import {
  getFilterConfig,
} from '../filterConfig';

const INITIAL_RESULT_COUNT = 100;

export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(queryParams.segment);
  const query = { ...resourceData.query };
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryValue = get(queryParams, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  if (queryIndex.match(/isbn|issn/)) {
    const identifierTypes = resourceData?.identifier_types?.records ?? [];
    queryTemplate = getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex);
  }

  if (queryIndex === 'querySearch' && queryValue.match('sortby')) {
    query.sort = '';
  } else if (!query.sort) {
    // Default sort for filtering/searching instances/holdings/items should be by title (UIIN-1046)
    query.sort = 'title';
  }

  resourceData.query = { ...query, qindex: '' };

  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2
  )(queryParams, pathComponents, resourceData, logger, props);
}

export function buildManifestObject() {
  return {
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'title',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    records: {
      type: 'okapi',
      records: 'instances',
      resultOffset: '%{resultOffset}',
      perRequest: 100,
      path: 'inventory/instances',
      GET: {
        params: { query: buildQuery },
        staticFallback: { params: {} },
      },
    },
    recordsToExportIDs: {
      type: 'okapi',
      records: 'ids',
      accumulate: true,
      fetch: false,
      path: 'instance-bulk/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildQuery,
          limit: '2147483647',
        },
        staticFallback: { params: {} },
      },
    },
    itemsInTransitReport: {
      type: 'okapi',
      records: 'items',
      path: 'inventory-reports/items-in-transit',
      accumulate: true,
      fetch: false,
    },
  };
}
