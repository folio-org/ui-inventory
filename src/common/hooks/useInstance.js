import { useMemo } from 'react';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

const useInstance = (id) => {
  const {
    isLoading: isSearchInstanceByIdLoading,
    instance: _instance,
  } = useSearchInstanceByIdQuery(id);

  const instanceTenantId = _instance?.tenantId;
  const isShared = _instance?.shared;

  const {
    isLoading: isInstanceLoading,
    isFetching,
    instance: data,
    refetch,
    ...rest
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

  return {
    instance,
    isLoading,
    isFetching,
    refetch,
    ...rest,
  };
};

export default useInstance;
