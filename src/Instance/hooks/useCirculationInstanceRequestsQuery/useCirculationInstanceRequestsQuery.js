import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { REQUEST_OPEN_STATUSES } from '../../../constants';

const requestOpenStatuses = Object.values(REQUEST_OPEN_STATUSES);
const instanceRequestsQuery = requestOpenStatuses.map(status => `status=="${status}"`).join(' OR ');

const useCirculationInstanceRequestsQuery = (instanceId, tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'circulation-instance-requests' });


  const { isLoading, data = {}, isFetching } = useQuery(
    [namespace, instanceId],
    () => ky.get('circulation/requests', {
      searchParams: {
        query: `instanceId==${instanceId} AND (${instanceRequestsQuery})`,
        limit: 1,
      },
    }).json(),
    { enabled: Boolean(instanceId) },
  );

  return ({
    isLoading,
    isFetching,
    data,
  });
};

export default useCirculationInstanceRequestsQuery;
