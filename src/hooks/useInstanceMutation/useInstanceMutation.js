import { useMutation } from 'react-query';

import { useTenantKy } from '../../common';

const useInstanceMutation = ({ tenantId, options = {} }) => {
  const ky = useTenantKy({ tenantId });

  const { mutateAsync } = useMutation({
    mutationFn: (instance) => {
      const kyMethod = instance.id ? 'put' : 'post';
      const kyPath = instance.id ? `inventory/instances/${instance.id}` : 'inventory/instances';

      return ky[kyMethod](kyPath, { json: instance });
    },
    ...options,
  });

  return {
    mutateInstance: mutateAsync,
  };
};

export default useInstanceMutation;
