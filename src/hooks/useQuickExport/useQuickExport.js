import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useQuickExport = () => {
  const ky = useOkapiKy();

  return useMutation({
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
    }
  });
};

export default useQuickExport;
