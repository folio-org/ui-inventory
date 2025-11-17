import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const NO_RECORDS_FOUND_ERROR = 'No records found';

const useSearchInstanceByIdQuery = (instanceId, { enabled = true } = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'search-instance' });

  const queryFn = async () => {
    // include Holdings id and Items id in mod-search response
    // they are required to move Items between Holdings records
    const include = ['holdings.id', 'items.id'];
    const response = await ky.get(`search/instances?query=id==${instanceId}&include=${include.join(',')}`).json();

    if (response.totalRecords === 0) {
      throw new Error(NO_RECORDS_FOUND_ERROR); // this triggers the retry mechanism
    }
    return response;
  };

  const { refetch, isLoading, data = {} } = useQuery(
    {
      queryKey: [namespace, instanceId],
      queryFn,
      enabled: Boolean(enabled && instanceId),
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false; // stop after 3 attempts
        if (error.message === NO_RECORDS_FOUND_ERROR) return true; // retry if no records
        return false; // stop retrying on other errors
      },
      retryDelay: () => 3000,
    },
  );

  return ({
    refetch,
    isLoading,
    instance: data?.instances?.[0],
  });
};

export default useSearchInstanceByIdQuery;
