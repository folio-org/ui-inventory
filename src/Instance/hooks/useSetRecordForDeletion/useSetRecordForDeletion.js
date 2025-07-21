import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useSetRecordForDeletion = (tenant) => {
  const ky = useOkapiKy({ tenant });

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: (id) => {
      return ky.delete(`inventory/instances/${id}/mark-deleted`);
    },
  });

  return {
    setRecordForDeletion: mutateAsync,
    isSetting: isLoading,
    setError: error,
  };
};

export default useSetRecordForDeletion;
