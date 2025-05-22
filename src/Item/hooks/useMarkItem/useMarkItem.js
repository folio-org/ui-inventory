import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useMarkItem = () => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async ({ itemId, markAs, body = {} }) => {
      try {
        const kyPath = `inventory/items/${itemId}/${markAs}`;
        return await ky.post(kyPath, { json: body });
      } catch (err) {
        throw new Error(`Failed to mark item as ${markAs}: ${err.message}`);
      }
    },
  });

  return {
    markItemAs: mutateAsync,
    isMarking: isLoading,
    markingError: error,
  };
};

export default useMarkItem;
