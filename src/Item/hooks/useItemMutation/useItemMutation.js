import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useItemMutation = (options = {}, { tenantId = '' } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const { mutateAsync: mutateItemAsync } = useMutation({
    mutationFn: (item) => {
      const kyMethod = item.id ? 'put' : 'post';
      const kyPath = item.id ? `inventory/items/${item.id}` : 'inventory/items';

      return ky[kyMethod](kyPath, { json: item });
    },
    ...options,
  });

  const { mutateAsync: deleteItemAsync } = useMutation({
    mutationFn: (itemId) => {
      return ky.delete(`inventory/items/${itemId}`);
    },
    ...options,
  });

  return {
    mutateItem: mutateItemAsync,
    deleteItem: deleteItemAsync,
  };
};

export default useItemMutation;
