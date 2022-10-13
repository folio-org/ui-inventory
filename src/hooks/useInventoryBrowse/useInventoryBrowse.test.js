import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { browseModeOptions, FACETS } from '../../constants';
import useInventoryBrowse from './useInventoryBrowse';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ search: '' })),
}))

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

describe('useInventoryBrowse', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetches browse data based on query and filters', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ filters }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(mockGet).toHaveBeenCalled();
    expect(result.current.data).toEqual(items);
  });

  it('should fetch browse data based on current anchor and direction', async () => {
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ filters }), { wrapper });

    await waitFor(() => !result.current.isFetching);
    await act(async() => result.current.pagination.onNeedMoreData(null, null, null, 'next'));

    expect(mockGet).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        searchParams: expect.objectContaining({ query: expect.stringMatching(/^.* > .*$/) })
      })
    );
  });
});
