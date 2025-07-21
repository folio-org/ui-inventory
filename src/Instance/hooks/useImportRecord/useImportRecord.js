import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useImportRecord = () => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading, error } = useMutation({
    mutationFn: async ({ instanceId, args }) => {
      try {
        const kyPath = `/inventory/import/${instanceId}`;
        const body = {
          xidtype: args.externalIdentifierType,
          xid: args.externalIdentifier,
          jobprofileid: args.selectedJobProfileId,
        };

        return await ky.post(kyPath, { json: body });
      } catch (err) {
        throw new Error(`Failed to import record: ${err.message}`);
      }
    },
  });

  return {
    importRecord: mutateAsync,
    isImporting: isLoading,
    importingError: error,
  };
};

export default useImportRecord;
