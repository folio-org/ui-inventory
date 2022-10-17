import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useBoundWithHoldings = (boundWithItems) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'boundWithHoldings' });

  const holdingRecordIds = boundWithItems.records?.map(x => x.holdingsRecordId);
  const queryIds = `id=${holdingRecordIds.join(' or ')}`;

  const { data, isLoading } = useQuery(
    [namespace, queryIds],
    () => ky.get(`holdings-storage/holdings?query=id=${queryIds}`).json(),
    { enabled: Boolean(queryIds) }
  );

  return {
    isLoading,
    boundWithHoldings: data?.holdingsRecords || [],
  };
};

export default useBoundWithHoldings;
