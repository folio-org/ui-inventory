import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

const useInstance = (id) => {
  const { instance: _instance } = useSearchInstanceByIdQuery(id);

  const instanceTenantId = _instance?.tenantId;
  const isShared = _instance?.shared;

  const { isLoading, instance } = useInstanceQuery(
    id,
    { tenantId: instanceTenantId },
    { enabled: Boolean(id && instanceTenantId) }
  );

  return {
    instance: {
      ...instance,
      shared: isShared,
      tenantId: instanceTenantId,
    },
    isLoading,
  };
};

export default useInstance;
