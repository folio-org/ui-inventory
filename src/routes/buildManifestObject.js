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

  if (queryIndex === 'advancedSearch' && queryValue.match('sortby')) {
    query.sort = '';
  }

  resourceData.query = { ...query, qindex: '' };

  // makeQueryFunction escapes quote and backslash characters by default,
  // but when submitting a raw CQL query (i.e. when queryIndex === 'advancedSearch')
  // we assume the user knows what they are doing and wants to run the CQL as-is.
  const cql = makeQueryFunction(
    CQL_FIND_ALL,
    queryTemplate,
    sortMap,
    filters,
    2,
    null,
    queryIndex !== 'advancedSearch',
  )(queryParams, pathComponents, resourceData, logger, props);

  return cql === undefined
    ? CQL_FIND_ALL
    : cql;
}

export function buildManifestObject() {
  return {
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    records: {
      type: 'okapi',
      records: 'instances',
      resultOffset: '%{resultOffset}',
      perRequest: 100,
      path: 'search/instances',
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
      path: 'search/instances/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildQuery,
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
    itemsInTransitReport: {
      type: 'okapi',
      records: 'items',
      path: 'inventory-reports/items-in-transit',
      accumulate: true,
      fetch: false,
    },
    facets: {
      type: 'okapi',
      records: 'facets',
      path: 'search/instances/facets',
      fetch: false,
      accumulate: true,
    },
  };
}
