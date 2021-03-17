import { useQueries } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

// Fetches and returns multiple instances for given instance ids
const useInstancesQuery = (ids = []) => {
  const ky = useOkapiKy();

  return useQueries(ids.map(id => ({
    queryKey: ['ui-inventory', 'instances', id],
    queryFn: () => ky.get(`inventory/instances/${id}`).json(),
  })));
};

export default useInstancesQuery;
