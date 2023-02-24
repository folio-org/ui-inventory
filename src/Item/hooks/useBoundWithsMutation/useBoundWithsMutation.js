import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useBoundWithsMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (boundWiths) => {
      const kyMethod = 'put';
      const kyPath = 'inventory-storage/bound-withs';
      return ky[kyMethod](kyPath, { json: boundWiths });
    },
    ...options,
  });

  return {
    mutateBoundWiths: mutateAsync,
  };
};

export default useBoundWithsMutation;
