import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useUpdateOwnershipMutation = path => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (body) => {
      return ky.post(path, { json: body });
    },
  });

  return {
    updateOwnership: mutateAsync,
  };
};

export default useUpdateOwnershipMutation;
