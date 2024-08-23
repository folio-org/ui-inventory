import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useUpdateOwnership = () => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (body) => {
      const kyPath = 'inventory/holdings/update-ownership';

      return ky.post(kyPath, { json: body });
    },
  });

  return {
    updateOwnership: mutateAsync,
  };
};

export default useUpdateOwnership;
