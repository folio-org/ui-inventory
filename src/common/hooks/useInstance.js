import {
  useCallback,
  useMemo,
} from 'react';

import { useStripes } from '@folio/stripes/core';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

const useInstance = (id) => {
  const stripes = useStripes();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const {
    refetch: refetchSearch,
    isLoading: isSearchInstanceByIdLoading,
    instance: _instance,
  } = useSearchInstanceByIdQuery(id);

  const isShared = _instance?.shared;
  const instanceTenantId = isShared ? centralTenantId : _instance?.tenantId;

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
    { enabled: Boolean(id && !isSearchInstanceByIdLoading && instanceTenantId) }
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
