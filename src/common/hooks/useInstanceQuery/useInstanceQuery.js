import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import useTenantKy from '../useTenantKy';

const useInstanceQuery = (instanceId, { tenantId }, options = {}) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'instance' });

  const { isLoading, data: instance = {} } = useQuery(
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
  });
};

export default useInstanceQuery;
