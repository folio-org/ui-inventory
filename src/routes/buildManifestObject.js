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
    // eslint-disable-next-line camelcase
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

  // makeQueryFunction escapes quote and backslash characters by default,
  // but when submitting a raw CQL query (i.e. when queryIndex === 'querySearch')
  // we assume the user knows what they are doing and wants to run the CQL as-is.
  return makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2,
    null,
    queryIndex !== 'querySearch',
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
      accumulate: false,
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
      path: 'record-bulk/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildQuery,
          limit: '2147483647',
        },
        staticFallback: { params: {} },
      },
    },
    quickExport: {
      type: 'okapi',
      fetch: false,
      path: 'data-export/quick-export',
      throwErrors: false,
      clientGeneratePk: false,
    },
    requests: {
      type: 'okapi',
      path: 'request-storage/requests',
      records: 'requests',
      accumulate: true,
      fetch: false,
    },
    instances: {
      type: 'okapi',
      path: 'inventory/instances',
      records: 'instances',
      accumulate: false,
      fetch: false,
    },
    holdings: {
      type: 'okapi',
      path: 'holdings-storage/holdings',
      records: 'holdingsRecords',
      accumulate: false,
      fetch: false,
    },
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      accumulate: true,
      fetch: false,
    },
    servicePoints: {
      type: 'okapi',
      path: 'service-points',
      records: 'servicepoints',
      accumulate: true,
      fetch: false,
    },
    itemsInTransitReport: {
      type: 'okapi',
      records: 'items',
      path: 'item-storage/items',
      accumulate: true,
      fetch: false,
    },
  };
}
