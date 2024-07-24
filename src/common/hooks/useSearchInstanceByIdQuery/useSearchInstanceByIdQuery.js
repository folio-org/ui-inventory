import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

const useSearchInstanceByIdQuery = (instanceId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'search-instance' });

  const { refetch, isLoading, data = {} } = useQuery(
    {
      queryKey: [namespace, instanceId],
      queryFn: () => ky.get(`search/instances?query=id==${instanceId}`).json(),
      enabled: Boolean(instanceId),
    },
  );

  return ({
    refetch,
    isLoading,
    instance: data?.instances?.[0],
  });
};

export default useSearchInstanceByIdQuery;
