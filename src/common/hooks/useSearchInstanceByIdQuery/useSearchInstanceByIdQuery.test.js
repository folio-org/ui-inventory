import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const instanceId = 'instanceId';

describe('useSearchInstanceByIdQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch instance successfully', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: jest.fn(() => ({
        json: jest.fn().mockResolvedValue({
          totalRecords: 1,
          instances: [{ id: instanceId }],
        }),
      })),
    });

    const { result } = renderHook(() => useSearchInstanceByIdQuery(instanceId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.instance.id).toBe(instanceId);
  });
});
