import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useHoldingMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (holding) => {
      const kyMethod = holding.id ? 'put' : 'post';
      const kyPath = holding.id ? `holdings-storage/holdings/${holding.id}` : 'holdings-storage/holdings';

      return ky[kyMethod](kyPath, { json: holding });
    },
    ...options,
  });

  return {
    mutateHolding: mutateAsync,
  };
};

export default useHoldingMutation;
