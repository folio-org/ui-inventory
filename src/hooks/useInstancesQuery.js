import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import usePrevious from './usePrevious';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (ids = []) => {
  const ky = useOkapiKy();
  const query = ids.map(id => `id==${id}`).join(' OR ');
  const prevQuery = usePrevious(query);
  const [queryKey] = useNamespace({ key: 'sub-instance' });
  const queryFn = () => ky.get('inventory/instances', { searchParams: { query, limit: 1000 } }).json();
  const enabled = query.length > 0 && prevQuery !== query;

  return useQuery([queryKey, query], queryFn, { enabled });
};

export default useInstancesQuery;
