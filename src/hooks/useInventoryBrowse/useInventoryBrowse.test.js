import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import {
  browseModeOptions,
  FACETS,
  PAGE_DIRECTIONS,
} from '../../constants';
import { INIT_PAGE_CONFIG } from './constants';
import useInventoryBrowse from './useInventoryBrowse';
import * as storage from '../../storage';

jest.mock('../../storage');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '' })),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const items = [{
  isAnchor: true,
}];
const data = {
  items,
  prev: 'bar',
  next: 'foo',
  totalRecords: items.length,
};
const filters = {
  query: 'baz',
  qindex: browseModeOptions.CALL_NUMBERS,
  [FACETS.EFFECTIVE_LOCATION]: ['dc5f3f2d-9a39-4a54-bfb9-120c4e2c0bea'],
};
const pageParams = {
  pageConfig: INIT_PAGE_CONFIG,
  setPageConfig: jest.fn(),
};

const pageConfigKey = '@folio/inventory/browse.pageConfig';

describe('useInventoryBrowse', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  beforeEach(() => {
    queryClient.clear();
    storage.setItem.mockClear();
    storage.getItem.mockClear();
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetches browse data based on query and filters', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ filters, pageParams }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(mockGet).toHaveBeenCalled();
    expect(result.current.data).toEqual(items);
  });

  it('should provide updated page config state', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ filters, pageParams }), { wrapper });

    const direction = PAGE_DIRECTIONS.next;

    await waitFor(() => !result.current.isFetching);
    await act(async () => result.current.pagination.onNeedMoreData(null, null, null, direction));

    const initPageConfig = pageParams.pageConfig;
    const newPageConfig = pageParams.setPageConfig.mock.calls.at(-1)[0]([initPageConfig[0]]);

    expect(newPageConfig).toEqual([initPageConfig[0] + 1, direction, data[direction]]);
  });

  it('should apply the page config from the storage', async () => {
    const prevPageConfig = [1, null, null];

    storage.getItem.mockImplementation(() => prevPageConfig);
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ pageConfigKey, filters, pageParams }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(storage.getItem).toHaveBeenCalledWith(pageConfigKey, { fromLocalStorage: true });
    expect(pageParams.setPageConfig).toHaveBeenCalledWith(prevPageConfig);

    storage.getItem.mockRestore();
  });

  it('should write the updated page config to storage', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ pageConfigKey, filters, pageParams }), { wrapper });

    const direction = PAGE_DIRECTIONS.next;

    await waitFor(() => !result.current.isFetching);
    await act(async () => result.current.pagination.onNeedMoreData(null, null, null, direction));

    const initPageConfig = pageParams.pageConfig;
    const newPageConfig = pageParams.setPageConfig.mock.calls.at(-1)[0]([initPageConfig[0]]);

    expect(storage.setItem).toHaveBeenCalledWith(pageConfigKey, newPageConfig, { toLocalStorage: true });
  });

  it('should fetch browse data based on current anchor and direction', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({
      filters,
      pageParams: {
        ...pageParams,
        pageConfig: [1, PAGE_DIRECTIONS.next, data.next],
      },
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(mockGet).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        searchParams: expect.objectContaining({ query: expect.stringMatching(/^.* > .*$/) })
      })
    );
  });
});
