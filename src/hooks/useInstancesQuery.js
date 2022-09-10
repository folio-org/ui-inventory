import { chunk } from 'lodash';
import { useQueries } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import usePrevious from './usePrevious';

const ITEMS_PER_CHUNK = 80;

const buildQuery = (ids, ky, queryKey, enabled) => {
  const query = ids.map(id => `id==${id}`).join(' OR ');

  return {
    queryFn: () => ky.get('inventory/instances', { searchParams: { query, limit: 1000 } }).json(),
    queryKey: [queryKey, 'instances', query],
    enabled
  };
};

const combineResults = (results) => {
  const initialValue = { data: { instances: [], totalRecords: 0 }, isSuccess: true };

  return results.reduce((acc, result) => {
    if (result?.data?.instances?.length) {
      acc.data.instances.push(...result.data.instances);
      acc.data.totalRecords += result?.data.totalRecords;
    }

    acc.isSuccess = acc.isSuccess && result.isSuccess;

    return acc;
  }, initialValue);
};

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (ids = []) => {
  const ky = useOkapiKy();
  const [queryKey] = useNamespace({ key: 'sub-instance' });
  const queryCache = ids.join();
  const prevQueryCache = usePrevious(queryCache);
  const enabled = queryCache && prevQueryCache !== queryCache;
  const chunks = chunk(ids, ITEMS_PER_CHUNK);
  const queries = chunks.map(chunkWithIds => buildQuery(chunkWithIds, ky, queryKey, enabled));
  const results = useQueries(queries);

  return combineResults(results);
};

export default useInstancesQuery;
