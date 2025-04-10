import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

const useSharedInstancesQuery = ({ searchParams } = {}) => {
  const [namespace] = useNamespace({ key: 'sharing-instances' });
  const ky = useOkapiKy();
  const stripes = useStripes();

  const { id: consortiumId } = stripes.user.user.consortium || {};

  const { data, isLoading } = useQuery(
    [namespace, consortiumId, searchParams],
    () => ky.get(`consortia/${consortiumId}/sharing/instances`, {
      searchParams,
    }).json(),
    {
      enabled: Boolean(consortiumId),
    },
  );

  return {
    sharedInstances: data?.sharingInstances,
    isLoadingSharedInstances: isLoading,
  };
};

export { useSharedInstancesQuery };
