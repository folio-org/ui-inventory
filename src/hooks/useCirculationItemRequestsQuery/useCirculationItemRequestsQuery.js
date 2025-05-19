import { useQuery } from 'react-query';
import { map } from 'lodash';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { REQUEST_OPEN_STATUSES } from '../../constants';

const requestsStatusString = map(REQUEST_OPEN_STATUSES, requestStatus => `"${requestStatus}"`).join(' or ');

const useCirculationItemRequestsQuery = (itemId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'circulation-item-requests' });


  const { isLoading, data: requests = {}, isFetching } = useQuery(
    [namespace, itemId],
    () => ky.get('circulation/requests', {
      searchParams: {
        query: `(itemId==${itemId}) and status==(${requestsStatusString}) sortby requestDate desc`,
        limit: 1,
      },
    }).json(),
    { enabled: Boolean(itemId) },
  );

  return ({
    isLoading,
    isFetching,
    requests,
  });
};

export default useCirculationItemRequestsQuery;
