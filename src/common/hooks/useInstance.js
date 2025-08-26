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

  const {
    refetch: refetchSearch,
    isLoading: isSearchInstanceByIdLoading,
    instance: _instance,
  } = useSearchInstanceByIdQuery(id);

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
    () => {
      if (!isSearchInstanceByIdLoading && !isInstanceLoading) {
        return Object.assign(_instance, data, { shared: isShared, tenantId: instanceTenantId });
      }

      return {};
    },
    [isSearchInstanceByIdLoading, isInstanceLoading, _instance, data, isShared, instanceTenantId],
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
