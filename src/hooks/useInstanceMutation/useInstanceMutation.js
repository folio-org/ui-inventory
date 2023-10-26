import { useMutation } from 'react-query';

import { useTenantKy } from '../../common';

const useInstanceMutation = ({ tenantId, options = {} }) => {
  const ky = useTenantKy({ tenantId });

  const { mutate } = useMutation({
    mutationFn: (instance) => {
      const kyMethod = instance.id ? 'put' : 'post';
      const kyPath = instance.id ? `inventory/instances/${instance.id}` : 'inventory/instances';

      return ky[kyMethod](kyPath, { json: instance }).json();
    },
    ...options,
  });

  return {
    mutateInstance: mutate,
  };
};

export default useInstanceMutation;
