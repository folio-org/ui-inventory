import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

const useBoundWithHoldings = (boundWithItems) => {
  const ky = useOkapiKy();

  const queryKey = ['ui-inventory', 'bound-with-holdings', boundWithItems];
  const holdingRecordIds = boundWithItems.records?.map(x => x.holdingsRecordId);
  const query = `id=${holdingRecordIds.join(' or ')}`;
  const queryFn = () => ky.get(`holdings-storage/holdings?query=${query}`).json();

  const { data, isLoading } = useQuery({ queryKey, queryFn });

  return {
    isLoading,
    boundWithHoldings: data?.holdingsRecords || [],
  };
};

export default useBoundWithHoldings;
