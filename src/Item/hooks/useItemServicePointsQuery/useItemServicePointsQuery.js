import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { useQuery } from 'react-query';

const useItemServicePointsQuery = (servicePointId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'service-points' });

  const query = servicePointId && `id==${servicePointId}`;

  const { isLoading, data: servicePoints = {}, isFetching } = useQuery(
    [namespace, servicePointId],
    () => ky.get('service-points', {
      searchParams: {
        ...(query && { query }),
      },
    }).json(),
    { enabled: Boolean(servicePointId) },
  );

  return ({
    isLoading,
    isFetching,
    servicePoints: servicePoints.servicepoints || [],
  });
};

export default useItemServicePointsQuery;
