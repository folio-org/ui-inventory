import useChunkedCQLFetch from '../../../hooks/useChunkedCQLFetch';

const useBoundWithHoldings = (boundWithItems) => {
  const holdingsRecordIds = boundWithItems?.map(x => x.holdingsRecordId);

  const { items: holdingsRecords, isLoading } = useChunkedCQLFetch({
    ids: holdingsRecordIds,
    endpoint: 'holdings-storage/holdings',
    reduceFunction: (holdingQueries) => (
      holdingQueries.reduce((acc, curr) => {
        return [...acc, ...(curr?.data?.holdingsRecords ?? [])];
      }, [])
    )
  });

  return {
    isLoading,
    boundWithHoldings: holdingsRecords,
  };
};

export default useBoundWithHoldings;
