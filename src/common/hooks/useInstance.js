import {
  useCallback,
  useMemo,
} from 'react';

import { useStripes } from '@folio/stripes/core';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

import { isUserInConsortiumMode } from '../../utils';

const useInstance = (id) => {
  const stripes = useStripes();
  const isUserInConsortium = isUserInConsortiumMode(stripes);

  let isShared = false;
  let instanceTenantId = stripes?.okapi.tenant;

  // search instance by id (only in consortium mode) to get information about tenant and shared status
  const {
    refetch: refetchSearch,
    isLoading: isSearchInstanceByIdLoading,
    instance: _instance,
  } = useSearchInstanceByIdQuery(id, { enabled: Boolean(isUserInConsortium) });

  if (isUserInConsortium) {
    const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

    isShared = _instance?.shared;
    instanceTenantId = isShared ? centralTenantId : _instance?.tenantId;
  }

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
    if (isUserInConsortium) {
      refetchSearch().then(refetchInstance);
    } else {
      refetchInstance();
    }
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
