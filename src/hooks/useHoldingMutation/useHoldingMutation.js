import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useHoldingMutation = (tenant, options = {}) => {
  const ky = useOkapiKy({ tenant });

  const { mutateAsync } = useMutation({
    mutationFn: (holding) => {
      const kyMethod = holding.id ? 'put' : 'post';
      const kyPath = holding.id ? `inventory/holdings/${holding.id}` : 'holdings-storage/holdings';

      return ky[kyMethod](kyPath, { json: holding }).json();
    },
    ...options,
  });

  return {
    mutateHolding: mutateAsync,
  };
};

export default useHoldingMutation;
