import {
  get,
} from 'lodash';

import {
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import {
  FACETS,
  CQL_FIND_ALL,
  queryIndexes,
  getQueryTemplate,
  getTemplateForSelectedFromBrowseRecord,
  getAdvancedSearchTemplate,
} from "@folio/stripes-inventory-components";

import {
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
} from '../constants';
import {
  getIsbnIssnTemplate,
  replaceFilter,
} from '../utils';
import { getFilterConfig } from '../filterConfig';

const INITIAL_RESULT_COUNT = 100;
const DEFAULT_SORT = 'title';

const applyDefaultStaffSuppressFilter = (stripes, query) => {
  const isUserTouchedStaffSuppress = JSON.parse(sessionStorage.getItem(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY));

  const staffSuppressFalse = `${FACETS.STAFF_SUPPRESS}.false`;
  const staffSuppressTrue = `${FACETS.STAFF_SUPPRESS}.true`;

  if (!query.query && query.filters === staffSuppressFalse && !isUserTouchedStaffSuppress) {
    // if query is empty and the only filter value is staffSuppress.false and search was not initiated by user action
    // then we need to clear the query.filters here to not automatically search when Inventory search is opened
    query.filters = undefined;
  }

  const isStaffSuppressFilterAvailable = stripes.hasPerm('ui-inventory.instance.view-staff-suppressed-records');
  const isStaffSuppressTrueSelected = query.filters?.includes(`${FACETS.STAFF_SUPPRESS}.true`);

  if (!isStaffSuppressFilterAvailable && isStaffSuppressTrueSelected) {
    query.filters = replaceFilter(query.filters, staffSuppressTrue, staffSuppressFalse);
  }
};

export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(queryParams.segment);
  const query = { ...resourceData.query };
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryValue = get(queryParams, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  const template = getTemplateForSelectedFromBrowseRecord(queryParams, queryIndex, queryValue);

  if (template) {
    queryTemplate = template;
  }

  if (queryIndex === queryIndexes.ADVANCED_SEARCH) {
    queryTemplate = getAdvancedSearchTemplate(queryValue);
  }

  if (queryIndex.match(/isbn|issn/)) {
    // eslint-disable-next-line camelcase
    const identifierTypes = resourceData?.identifier_types?.records ?? [];
    queryTemplate = getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex);
  }

  if (queryIndex === queryIndexes.QUERY_SEARCH && queryValue.match('sortby')) {
    query.sort = '';
  } else if (query.sort && query.sort === 'relevance') {
    query.sort = '';
  } else if (!query.sort) {
    // Default sort for filtering/searching instances/holdings/items should be by title (UIIN-1046)
    query.sort = DEFAULT_SORT;
  }

  applyDefaultStaffSuppressFilter(props.stripes, query);

  resourceData.query = {
    ...query,
    qindex: '',
  };

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

const buildRecordsManifest = (options = {}) => {
  const { path } = options;

  return {
    type: 'okapi',
    records: 'instances',
    resultOffset: '%{resultOffset}',
    perRequest: 100,
    throwErrors: false,
    path: 'inventory/instances',
    resultDensity: 'sparse',
    accumulate: 'true',
    GET: {
      path,
      params: {
        expandAll: true,
        query: buildQuery,
      },
    },
  };
};

export function buildManifestObject() {
  return {
    numFiltersLoaded: { initialValue: 1 }, // will be incremented as each filter loads
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: '',
        selectedBrowseResult: false,
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultOffset: { initialValue: 0 },
    records: buildRecordsManifest({
      path: 'search/instances',
    }),
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
    itemsByQuery: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      accumulate: true,
      fetch: false,
    },
  };
}
