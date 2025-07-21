import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useInstanceImportSupportedQuery = (instanceId, { enabled = true } = {}) => {
  const [namespace] = useNamespace({ key: 'instance-import-supported' });
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    [namespace, instanceId],
    () => ky.get(`linked-data/inventory-instance/${instanceId}/import-supported`).json(),
    {
      enabled: Boolean(enabled && instanceId),
    },
  );

  return {
    data,
    isLoading,
  };
};

export default useInstanceImportSupportedQuery;
