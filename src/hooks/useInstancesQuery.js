import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (ids = []) => {
  const ky = useOkapiKy();
  const query = ids.map(id => `id==${id}`).join(' OR ');
  const [queryKey] = useNamespace({ key: 'sub-instance' });
  const queryFn = () => ky.get('inventory/instances', { searchParams: { query } }).json();

  return useQuery([queryKey, query], queryFn, { enabled: query.length > 0 });
};

export default useInstancesQuery;
