import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import useTenantKy from '../useTenantKy';

const useInstanceQuery = (instanceId, { tenantId = '' } = {}, options = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'instance' });

  const {
    isLoading,
    data: instance = {},
    refetch,
    ...rest
  } = useQuery(
    [namespace, instanceId, tenantId],
    () => ky.get(`inventory/instances/${instanceId}`).json(),
    {
      enabled: Boolean(instanceId),
      ...options,
    },
  );

  return ({
    isLoading,
    instance,
    refetch,
    ...rest,
  });
};

export default useInstanceQuery;
