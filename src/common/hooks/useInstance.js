import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';
import {useMemo} from "react";

const useInstance = (id) => {
  const { instance: _instance } = useSearchInstanceByIdQuery(id);

  const instanceTenantId = _instance?.tenantId;
  const isShared = _instance?.shared;

  const { isLoading, instance: data } = useInstanceQuery(
    id,
    { tenantId: instanceTenantId },
    { enabled: Boolean(id && instanceTenantId) }
  );

  const instance = useMemo(
    () => ({
      ...data,
      shared: isShared,
      tenantId: instanceTenantId,
    }),
    [data, isShared, instanceTenantId],
  );

  return {
    instance,
    isLoading,
  };
};

export default useInstance;
