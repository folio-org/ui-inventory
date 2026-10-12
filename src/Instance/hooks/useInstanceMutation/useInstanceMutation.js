import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useInstanceMutation = ({ tenantId, options = {} }) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const { mutateAsync } = useMutation({
    mutationFn: (instance) => {
      const kyMethod = instance.id ? 'put' : 'post';
      const kyPath = instance.id ? `inventory/instances/${instance.id}` : 'inventory/instances';

      return ky[kyMethod](kyPath, { json: instance }).json();
    },
    ...options,
  });

  return {
    mutateInstance: mutateAsync,
  };
};

export default useInstanceMutation;
