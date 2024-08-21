import {
  useCallback,
  useMemo,
} from 'react';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

const useInstance = (id) => {
  const {
    refetch: refetchSearch,
    isLoading: isSearchInstanceByIdLoading,
    instance: _instance,
  } = useSearchInstanceByIdQuery(id);

  const instanceTenantId = _instance?.tenantId;
  const isShared = _instance?.shared;

  const {
    refetch: refetchInstance,
    isLoading: isInstanceLoading,
    isFetching,
    instance: data,
    isError,
    error,
  } = useInstanceQuery(
    id,
    { tenantId: instanceTenantId },
    { enabled: Boolean(id && !isSearchInstanceByIdLoading) }
  );

  const instance = useMemo(
    () => ({
      ...data,
      shared: isShared,
      tenantId: instanceTenantId,
    }),
    [data, isShared, instanceTenantId],
  );
  const isLoading = useMemo(
    () => isSearchInstanceByIdLoading || isInstanceLoading,
    [isSearchInstanceByIdLoading, isInstanceLoading],
  );
  const refetch = useCallback(() => {
    refetchSearch().then(() => refetchInstance());
  });

  return {
    instance,
    isLoading,
    isFetching,
    refetch,
    isError,
    error,
  };
};

export default useInstance;
