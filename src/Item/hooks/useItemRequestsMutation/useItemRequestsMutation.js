import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useItemRequestsMutation = () => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async (request) => {
      try {
        const kyPath = `circulation/requests/${request.id}`;
        return await ky.put(kyPath, { json: request });
      } catch (err) {
        throw new Error(`Failed to update request: ${err.message}`);
      }
    },
  });

  return {
    mutateRequests: mutateAsync,
    isMutating: isLoading,
    mutationError: error,
  };
};

export default useItemRequestsMutation;
