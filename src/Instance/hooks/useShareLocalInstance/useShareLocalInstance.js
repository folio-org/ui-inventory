import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useShareLocalInstance = () => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async ({ consortiumId, body }) => {
      try {
        const kyPath = `consortia/${consortiumId}/sharing/instances`;
        return await ky.post(kyPath, { json: body });
      } catch (err) {
        throw new Error(`Failed to share instance: ${err.message}`);
      }
    },
  });

  return {
    shareInstance: mutateAsync,
    isSharing: isLoading,
    sharingError: error,
  };
};

export default useShareLocalInstance;
