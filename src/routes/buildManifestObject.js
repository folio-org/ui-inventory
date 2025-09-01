import {
  buildSearchQuery,
  buildRecordsManifest,
  FACETS,
} from '@folio/stripes-inventory-components';

import { addFilter } from '../utils';

const INITIAL_RESULT_COUNT = 100;

export const applyDefaultStaffSuppressFilter = (query, stripes) => {
  const isStaffSuppressFilterAvailable = stripes.hasPerm('ui-inventory.instance.staff-suppressed-records.view');

  // if a user doesn't have view staff suppress facet permission - we need to hide staff suppressed records by default
  if (!isStaffSuppressFilterAvailable) {
    const staffSuppressFalse = `${FACETS.STAFF_SUPPRESS}.false`;

    if (!query.query && (!query.filters || query.filters === staffSuppressFalse)) {
      // if query is empty and the only filter value is staffSuppress.false or it's empty
      // then we know that this function call was not initiated by a user performing search
      // so we need to clear filters to avoid unnecessary search on page load
      query.filters = undefined;
    } else {
      query.filters = addFilter(query.filters, staffSuppressFalse);
    }
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
