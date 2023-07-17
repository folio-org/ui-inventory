import { useCallback, useEffect, useState } from 'react';
import { useQueries } from 'react-query';

import { chunk } from 'lodash';

import { useOkapiKy } from '@folio/stripes/core';

// When fetching from a potentially large list of items,
// make sure to chunk the request to avoid hitting limits.
const useChunkedCQLFetch = ({
  endpoint, // endpoint to hit to fetch items
  ids, // List of ids to fetch
  reduceFunction // Function to reduce fetched objects at the end into single array
}) => {
  const ky = useOkapiKy();

  const CONCURRENT_REQUESTS = 5; // Number of requests to make concurrently
  const STEP_SIZE = 60; // Number of ids to request for per concurrent request

  const chunkedItems = chunk(ids, STEP_SIZE);
  // chunkedItems will be an array of arrays of size CONCURRENT_REQUESTS * STEP_SIZE
  // We need to parallelise CONCURRENT_REQUESTS at a time,
  // and ensure we only fire the next lot once the previous lot are through

  const [isLoading, setIsLoading] = useState(ids?.length > 0);

  // Set up query array, and only enable the first CONCURRENT_REQUESTS requests
  const getQueryArray = useCallback(() => {
    const queryArray = [];
    chunkedItems.forEach((chunkedItem, chunkedItemIndex) => {
      const query = chunkedItem.map(item => `id==${item}`).join(' or ');
      queryArray.push({
        queryKey: ['ERM', endpoint, chunkedItem],
        queryFn: () => ky.get(`${endpoint}?limit=1000&query=${query}`).json(),
        // Only enable once the previous slice has all been fetched
        enabled: chunkedItemIndex < CONCURRENT_REQUESTS
      });
    });

    return queryArray;
  }, [chunkedItems, endpoint, ky]);

  const itemQueries = useQueries(getQueryArray());

  // Once chunk has finished fetching, fetch next chunk
  useEffect(() => {
    const chunkedQuery = chunk(itemQueries, CONCURRENT_REQUESTS);
    chunkedQuery.forEach((q, i) => {
      // Check that all previous chunk are fetched,
      // and that all of our current chunk are not fetched and not loading
      if (
        i !== 0 &&
        chunkedQuery[i - 1]?.every(pq => pq.isFetched === true) &&
        q.every(req => req.isFetched === false) &&
        q.every(req => req.isLoading === false)
      ) {
        // Trigger fetch for each request in the chunk
        q.forEach(req => {
          req.refetch();
        });
      }
    });
  }, [itemQueries]);

  // Keep easy track of whether this hook is all loaded or not
  // (This slightly flattens the "isLoading/isFetched" distinction, but it's an ease of use prop)
  useEffect(() => {
    const newLoading = ids?.length > 0 && (!itemQueries?.length || itemQueries?.some(uq => !uq.isFetched));

    if (isLoading !== newLoading) {
      setIsLoading(newLoading);
    }
  }, [isLoading, itemQueries, ids?.length]);


  return {
    itemQueries,
    isLoading,
    // Offer all fetched orderLines in flattened array once ready
    items: isLoading ? [] : reduceFunction(itemQueries)
  };
};

export default useChunkedCQLFetch;
