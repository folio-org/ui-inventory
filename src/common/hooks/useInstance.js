import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

const useInstance = (id) => {
  const { instance: _instance } = useSearchInstanceByIdQuery(id);

  const instanceTenantId = _instance?.tenantId;
  const isShared = _instance?.shared;

  const { isLoading, instance: data } = useInstanceQuery(
    id,
    { tenantId: instanceTenantId },
    { enabled: Boolean(id && instanceTenantId) }
  );

  const instance = {
    ...data,
    shared: isShared,
    tenantId: instanceTenantId,
  };

  return {
    instance,
    isLoading,
  };
};

export default useInstance;
