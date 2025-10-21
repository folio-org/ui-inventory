import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useResourceMetadataQuery = (instanceId, { enabled = true } = {}) => {
  const [namespace] = useNamespace({ key: 'resource-metadata' });
  const ky = useOkapiKy();

  const { data, isLoading, refetch } = useQuery(
    [namespace, instanceId],
    () => ky.get(`linked-data/resource/metadata/${instanceId}/id`).json(),
    {
      enabled: Boolean(enabled && instanceId),
    },
  );

  return {
    data,
    isLoading,
    refetch
  };
};

export default useResourceMetadataQuery;
