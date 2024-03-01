import {
  get,
} from 'lodash';

import {
  makeQueryFunction,
  advancedSearchQueryToRows,
} from '@folio/stripes/smart-components';
import {
  CQL_FIND_ALL,
  fieldSearchConfigurations,
  queryIndexes,
  FACETS,
} from '../constants';
import {
  getQueryTemplate,
  getIsbnIssnTemplate,
} from '../utils';
import { getFilterConfig } from '../filterConfig';

const INITIAL_RESULT_COUNT = 100;
const DEFAULT_SORT = 'title';

const getQueryTemplateContributor = (queryValue) => `contributors.name==/string "${queryValue}"`;
const getAdvancedSearchQueryTemplate = (queryIndex, matchOption) => fieldSearchConfigurations[queryIndex]?.[matchOption];

export const getAdvancedSearchTemplate = (queryValue) => {
  return advancedSearchQueryToRows(queryValue).reduce((acc, row) => {
    const rowTemplate = getAdvancedSearchQueryTemplate(row.searchOption, row.match);

    if (!rowTemplate) {
      return acc;
    }

    const rowQuery = rowTemplate.replaceAll('%{query.query}', row.query);

    const formattedRow = `${row.bool} ${rowQuery}`.trim();
    return `${acc} ${formattedRow}`;
  }, '').trim();
};

const applyDefaultStaffSuppressFilter = (query, isStaffSuppressFilterAvailable) => {
  const staffSuppressFalse = `${FACETS.STAFF_SUPPRESS}.false`;

  if (!query.query && query.filters === staffSuppressFalse) {
    // if query is empty and the only filter value is staffSuppress.false - that means that search was not initiated by user action but by default applied
    // staffSuppress filter. need to clear the query.filters here to not automatically search when Inventory search is opened
    query.filters = undefined;
  } else if (isStaffSuppressFilterAvailable) {
    // if we have a query and/or filters and user has access to Staff Suppress filter - then do nothing - don't remove anything, don't add anything.
    // let the user handle what Staff Suppress filter values they want selected
  } else if ((query.query || query.filters) && !query.filters?.includes(staffSuppressFalse)) {
    // if user doesn't have access to Staff Suppress filter and query and/or filters are not empty and don't already contain staffSuppress
    // then add staffSuppress.false to filters
    query.filters = `${query.filters},${staffSuppressFalse}`;
  }
};

export function buildQuery(queryParams, pathComponents, resourceData, logger, props) {
  const { indexes, sortMap, filters } = getFilterConfig(queryParams.segment);
  const query = { ...resourceData.query };
  const queryIndex = queryParams?.qindex ?? 'all';
  const queryValue = get(queryParams, 'query', '');
  let queryTemplate = getQueryTemplate(queryIndex, indexes);

  if (queryParams?.selectedBrowseResult) {
    if (queryIndex === queryIndexes.CONTRIBUTOR) {
      const escapedQueryValue = queryValue.replaceAll('"', '\\"');

      queryTemplate = getQueryTemplateContributor(escapedQueryValue);
    }

    query.selectedBrowseResult = null; // reset this parameter so the next search uses `=` instead of `==/string`
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

  const isStaffSuppressFilterAvailable = props.stripes.hasPerm('ui-inventory.instance.view-staff-suppressed-records');

  applyDefaultStaffSuppressFilter(query, isStaffSuppressFilterAvailable);

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
