import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useItemMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (item) => {
      const kyMethod = item.id ? 'put' : 'post';
      const kyPath = item.id ? `inventory/items/${item.id}` : 'inventory/items';

      return ky[kyMethod](kyPath, { json: item });
    },
    ...options,
  });

  return {
    mutateItem: mutateAsync,
  };
};

export default useItemMutation;
