export default function buildManifestObject(buildQuery) {
  return {
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
      records: 'instances',
      accumulate: true,
      fetch: false,
      path: 'inventory/instances',
      GET: {
        params: {
          query: buildQuery,
          limit: '30',
        },
        staticFallback: { params: {} },
      },
    },
  };
}
