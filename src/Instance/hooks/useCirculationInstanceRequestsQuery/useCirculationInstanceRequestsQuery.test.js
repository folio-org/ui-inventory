import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useCirculationInstanceRequestsQuery from './useCirculationInstanceRequestsQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCirculationInstanceRequestsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          requests: [{ id: 'request-id' }],
          totalRecords: 1,
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch circulation requests', async () => {
    const { result } = renderHook(() => useCirculationInstanceRequestsQuery('instance-id'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ requests: [{ id: 'request-id' }], totalRecords: 1 });
  });
});
