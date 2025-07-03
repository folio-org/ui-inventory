import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useInstanceHoldingsQuery from './useInstanceHoldingsQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceHoldingsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          holdingsRecords: [{ id: 'holding-id' }],
          totalRecords: 1,
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch holdings', async () => {
    const { result } = renderHook(() => useInstanceHoldingsQuery('instance-id'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.holdingsRecords).toEqual([{ id: 'holding-id' }]);
    expect(result.current.totalRecords).toEqual(1);
  });
});
