import { range, chunk, flatten } from 'lodash';

const LIMIT = 100;
const CHUNKS_SIZE = 5;

const batchLoadRecords = (mutator, offsetChunks, params) => {
  const recordsPromise = Promise.resolve([]);

  return offsetChunks.reduce((recordsPromiseAcc, offsetChunk) => {
    const newRecordsPromise = recordsPromiseAcc
      .then((response) => {
        const offsetChunkPromise = Promise.all(
          offsetChunk.map(offset => {
            return mutator.GET({
              params: {
                ...params,
                limit: LIMIT,
                offset,
              },
            });
          }),
        );

        return Promise.all([...response, offsetChunkPromise]);
      });

    return newRecordsPromise;
  }, recordsPromise);
};

export const getRecordsInBatch = (mutator, params) => {
  return mutator.GET({
    params: {
      ...params,
      limit: 0,
    },
    records: undefined,
  })
    .then(({ totalRecords }) => {
      const offsets = range(0, totalRecords, LIMIT);

      return chunk(offsets, CHUNKS_SIZE);
    })
    .then(offsetChunks => {
      return batchLoadRecords(mutator, offsetChunks, params);
    })
    .then(
      chunks => flatten(chunks).reduce((acc, recordsChunk) => [...acc, ...recordsChunk], []),
    );
};

export const buildQueryByHoldingsIds = (recordsChunk) => {
  const query = recordsChunk
    .map(holding => `holdingsRecordId==${holding.id}`)
    .join(' or ');

  return query || '';
};

export const buildQueryByItemsIds = (recordsChunk) => {
  const query = recordsChunk
    .map(item => `itemId==${item.id}`)
    .join(' or ');

  return query || '';
};

export const batchFetch = (mutator, records, buildQuery, _params = {}, extraQuery = '') => {
  mutator.reset();

  if (!records?.length) return Promise.resolve([]);

  const batchRequests = chunk(records, 25).map(recordsChunk => {
    const query = buildQuery(recordsChunk);

    if (!query) return Promise.resolve([]);

    const params = {
      ..._params,
      query: `(${query})${extraQuery ? ` ${extraQuery}` : ''}`,
    };

    return getRecordsInBatch(mutator, params);
  });

  return Promise.all(batchRequests)
    .then((responses) => flatten(responses));
};

export const batchFetchItems = (mutator, holdings) => {
  return batchFetch(mutator, holdings, buildQueryByHoldingsIds, undefined, 'sortby barcode asc');
};
