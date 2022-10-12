import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { browseModeOptions, FACETS } from '../../constants';
import useInventoryBrowse from './useInventoryBrowse';

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

  it('fetches browse data', async () => {
    const filters = {
      query: 'baz',
      qindex: browseModeOptions.CALL_NUMBERS,
      [FACETS.EFFECTIVE_LOCATION]: ['dc5f3f2d-9a39-4a54-bfb9-120c4e2c0bea'],
    };
    const { result, waitFor } = renderHook(() => useInventoryBrowse({ filters }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(mockGet).toHaveBeenCalled();
    expect(result.current.data).toEqual(items);
  });
});
