import {
  getRecordsInBatch,
  buildQueryByHoldingsIds,
  buildQueryByItemsIds,
  batchFetch,
  batchFetchItems,
  batchFetchRequests,
} from './utils';

import '../../../test/jest/__mock__';

describe('getRecordsInBatch', () => {
  const mockMutator = {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(),
  };
  it('should return an empty array if no records are found', async () => {
    mockMutator.GET.mockReturnValueOnce(Promise.resolve({ totalRecords: 0 }));
    const result = await getRecordsInBatch(mockMutator, {});
    expect(result).toEqual([]);
  });
  it('should return all records in one batch if there are fewer records than the limit', async () => {
    const records = [{ id: '1' }, { id: '2' }, { id: '3' }];
    mockMutator.GET.mockReturnValueOnce(Promise.resolve({ totalRecords: records.length }));
    mockMutator.GET.mockImplementationOnce(({ params }) => {
      const offset = params.offset || 0;
      const recordsChunk = records.slice(offset, offset + params.limit);
      return Promise.resolve(recordsChunk);
    });
    const result = await getRecordsInBatch(mockMutator, {});
    expect(result).toEqual(records);
  });
  it('should return all records in multiple batches if there are more records than the limit', async () => {
    const records = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' }, { id: '8' }];
    mockMutator.GET.mockReturnValueOnce(Promise.resolve({ totalRecords: records.length }));
    mockMutator.GET.mockImplementation(({ params }) => {
      const offset = params.offset || 0;
      const recordsChunk = records.slice(offset, offset + params.limit);
      return Promise.resolve(recordsChunk);
    });
    const result = await getRecordsInBatch(mockMutator, {});
    expect(result).toEqual(records);
  });
});

describe('buildQueryByHoldingsIds', () => {
  it('should return empty string when given an empty array', () => {
    const query = buildQueryByHoldingsIds([]);
    expect(query).toBe('');
  });
  it('should return a query string when given an array of holdings', () => {
    const holdings = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];
    const query = buildQueryByHoldingsIds(holdings);
    expect(query).toBe('holdingsRecordId==1 or holdingsRecordId==2 or holdingsRecordId==3');
  });
  it('should handle a single holding in the array', () => {
    const holdings = [
      { id: 1 },
    ];
    const query = buildQueryByHoldingsIds(holdings);
    expect(query).toBe('holdingsRecordId==1');
  });
});

describe('buildQueryByItemsIds', () => {
  it('returns empty string for empty input', () => {
    const result = buildQueryByItemsIds([]);
    expect(result).toEqual('');
  });
  it('returns correct query for single item', () => {
    const result = buildQueryByItemsIds([{ id: 123 }]);
    expect(result).toEqual('itemId==123');
  });
  it('returns correct query for multiple items', () => {
    const result = buildQueryByItemsIds([{ id: 123 }, { id: 456 }, { id: 789 }]);
    expect(result).toEqual('itemId==123 or itemId==456 or itemId==789');
  });
  it('returns empty string for input without ids', () => {
    const result = buildQueryByItemsIds([{ foo: 'bar' }]);
    expect(result).toEqual('itemId==undefined');
  });
});

describe('batchFetch', () => {
  const mutator = {
    reset: jest.fn(),
    GET: jest.fn(),
  };
  beforeEach(() => {
    mutator.reset.mockClear();
    mutator.GET.mockClear();
  });
  it('should return empty array when no records are provided', async () => {
    const records = [];
    const buildQuery = jest.fn();
    const response = await batchFetch(mutator, records, buildQuery);
    expect(response).toEqual([]);
    expect(mutator.reset).toHaveBeenCalledTimes(1);
    expect(mutator.GET).toHaveBeenCalledTimes(0);
  });
  it('should return empty array when query is empty', async () => {
    const records = [{ id: 1 }];
    const buildQuery = jest.fn(() => '');
    const response = await batchFetch(mutator, records, buildQuery);
    expect(response).toEqual([]);
    expect(mutator.reset).toHaveBeenCalledTimes(1);
    expect(mutator.GET).toHaveBeenCalledTimes(0);
  });
  it('should return records when mutator.GET returns data', async () => {
    const records = [{ id: 1 }, { id: 2 }];
    const buildQuery = buildQueryByHoldingsIds;
    const data = [];
    mutator.GET.mockResolvedValueOnce({ data });
    const response = await batchFetch(mutator, records, buildQuery);
    expect(response).toEqual(data);
    expect(mutator.reset).toHaveBeenCalledTimes(1);
    expect(mutator.GET).toHaveBeenCalledTimes(1);
    expect(mutator.GET).toHaveBeenCalledWith({
      params: {
        limit: 0,
        query: '(holdingsRecordId==1 or holdingsRecordId==2)',
      },
      records: undefined,
    });
  });
});

describe('batchFetchItems', () => {
  const mockMutator = {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(),
  };
  it('returns an empty array if holdings are empty', async () => {
    const result = await batchFetchItems(mockMutator, []);
    expect(result).toEqual([]);
  });
});

describe('batchFetchRequests', () => {
  let mutator;
  beforeEach(() => {
    mutator = {
      GET: jest.fn(),
      reset: jest.fn(),
    };
  });
  it('should return empty array if items array is empty', async () => {
    const result = await batchFetchRequests(mutator, []);
    expect(result).toEqual([]);
  });
  it('should flatten the response arrays and return the concatenated records', async () => {
    const records = [{ id: 1 }, { id: 2 }];
    mutator.GET.mockReturnValueOnce(Promise.resolve({ totalRecords: 2 }));
    mutator.GET.mockReturnValueOnce(Promise.resolve(records));
    const items = [{ id: 1 }, { id: 2 }];
    const result = await batchFetchRequests(mutator, items);
    expect(result).toEqual(records);
  });
});
