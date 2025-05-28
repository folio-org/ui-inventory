import { buildRecordsManifest } from '@folio/stripes-inventory-components';

const INITIAL_RESULT_COUNT = 100;

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
    records: buildRecordsManifest(),
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
