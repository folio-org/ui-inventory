import { get } from 'lodash';

import { makeQueryFunction } from '@folio/stripes/smart-components';
import { CQL_FIND_ALL } from '../constants';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../utils';
import {
  getFilterConfig,
  browseModeOptions
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
        sort: '',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    records: {
      type: 'okapi',
      records:  'instances',
      resultOffset: '%{resultOffset}',
      perRequest: 100,
      throwErrors: false,
      path: 'inventory/instances',
      resultDensity: 'sparse',
      GET: {
        path: 'search/instances',
        params: { query: buildQuery },
        staticFallback: { params: {} },
      },
    },
    recordsBrowseCallNumber: {
      type: 'okapi',
      records: 'items',
      resultOffset: '%{resultOffset}',
      perRequest: 100,
      throwErrors: false,
      path: (queryParams) => {
        const queryValue = get(queryParams, 'query', '');
        if (queryParams.qindex === browseModeOptions.CALL_NUMBERS) return `browse/call-numbers/instances?expandAll=true&query=callNumber>=${queryValue} or callNumber<${queryValue}&precedingRecordsCount=5&`;
        return undefined;
      }
    },
    recordsSubject: {
      type: 'okapi',
      records: 'items',
      resultOffset: '%{resultOffset}',
      perRequest: 100,
      throwErrors: false,
      path: (queryParams) => {
        const queryValue = get(queryParams, 'query', '');
        if (queryParams.qindex === browseModeOptions.SUBJECTS) return `browse/subjects/instances?expandAll=true&query=subject>=${queryValue} or subject<${queryValue}&precedingRecordsCount=5&`;
        return undefined;
      }
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
    holdingsToExportIDs: {
      type: 'okapi',
      records: 'ids',
      accumulate: true,
      fetch: false,
      path: 'search/holdings/ids',
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
  };
}
