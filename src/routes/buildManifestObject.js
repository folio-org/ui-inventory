import {
  FACETS,
  USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY,
  buildSearchQuery,
  buildRecordsManifest,
} from '@folio/stripes-inventory-components';

import { replaceFilter } from '../utils';

const INITIAL_RESULT_COUNT = 100;

export const applyDefaultStaffSuppressFilter = (query, stripes) => {
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
    requestUrlQuery: { initialValue: '' },
    records: buildRecordsManifest(applyDefaultStaffSuppressFilter),
    recordsToExportIDs: {
      type: 'okapi',
      records: 'ids',
      accumulate: true,
      fetch: false,
      path: 'search/instances/ids',
      throwErrors: false,
      GET: {
        params: {
          query: buildSearchQuery(applyDefaultStaffSuppressFilter),
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
          query: buildSearchQuery(applyDefaultStaffSuppressFilter),
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
