import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useUpdateOwnershipMutation = path => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: async (body) => {
      try {
        return await ky.post(path, { json: body });
      } catch (error) {
        if (error.response) {
          const errorData = await error.response.json();
          throw new Error(errorData.notUpdatedEntities?.[0]?.errorMessage || error.message);
        }

        throw error;
      }
    },
  });

  return {
    updateOwnership: mutateAsync,
  };
};

export default useUpdateOwnershipMutation;
