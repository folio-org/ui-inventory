import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useHolding = (holdingId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holding' });

  const { isLoading, data: holding = {} } = useQuery(
    [namespace, holdingId],
    () => ky.get(`holdings-storage/holdings/${holdingId}`).json(),
    { enabled: Boolean(holdingId) },
  );

  return ({
    isLoading,
    holding,
  });
};

export default useHolding;
