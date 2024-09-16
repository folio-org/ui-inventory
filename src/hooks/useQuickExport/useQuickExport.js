import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useQuickExport = () => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: ({ uuids, recordType }) => {
      return ky.post(
        'data-export/quick-export',
        {
          json: {
            uuids,
            type: 'uuid',
            recordType,
          },
        },
      );
    },
  });

  return {
    exportRecords: mutateAsync,
  };
};

export default useQuickExport;
