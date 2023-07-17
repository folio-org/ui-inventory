import useChunkedCQLFetch from '../../../hooks/useChunkedCQLFetch';

const useBoundWithHoldings = (boundWithItems) => {
  let holdingsRecordIds = boundWithItems?.map(x => x.holdingsRecordId);

  // De-dup the list of holdingsRecordIds for efficiency
  holdingsRecordIds = [...new Set(holdingsRecordIds)];

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
