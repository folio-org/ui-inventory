import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

const useHoldingsQueryByHrids = (holdingsRecordHrids) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'holdingsRecordsByHrid' });

  const queryHrids = holdingsRecordHrids.join(' or ');

  const { isLoading, data } = useQuery(
    [namespace, queryHrids],
    () => ky.get(`holdings-storage/holdings?query=hrid==(${queryHrids})`).json(),
    { enabled: Boolean(queryHrids) },
  );

  return ({
    isLoading,
    holdingsRecords: data?.holdingsRecords || [],
  });
};

export default useHoldingsQueryByHrids;
