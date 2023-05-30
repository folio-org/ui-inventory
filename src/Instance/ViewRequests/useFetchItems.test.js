import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import useFetchItems from './useFetchItems';
import { batchFetchItems } from './utils';

jest.mock('./utils', () => ({
  batchFetchItems: jest.fn(),
}));

describe('useFetchItems', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should not fetch items when instanceHoldings is empty', () => {
    const mutatorItems = jest.fn();
    const instanceHoldings = [];
    renderHook(() => useFetchItems(mutatorItems, instanceHoldings));
    expect(batchFetchItems).not.toHaveBeenCalled();
  });
  it('should fetch items when instanceHoldings is not empty', async () => {
    const mutatorItems = jest.fn();
    const instanceHoldings = ['item1', 'item2'];
    const items = ['item1', 'item2'];
    batchFetchItems.mockResolvedValueOnce(items);
    const { result, waitForNextUpdate } = renderHook(() => useFetchItems(mutatorItems, instanceHoldings));
    expect(batchFetchItems).toHaveBeenCalledWith(mutatorItems, instanceHoldings);
    await waitForNextUpdate();
    expect(result.current).toEqual(items);
  });
  it('should set items to empty array when batchFetchItems fails', async () => {
    const mutatorItems = jest.fn();
    const instanceHoldings = ['item1', 'item2'];
    batchFetchItems.mockRejectedValueOnce(new Error('Failed to fetch items'));
    const { result, waitForNextUpdate } = renderHook(() => useFetchItems(mutatorItems, instanceHoldings));
    expect(batchFetchItems).toHaveBeenCalledWith(mutatorItems, instanceHoldings);
    await waitForNextUpdate();
    expect(result.current).toEqual([]);
  });
});
