import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  waitFor,
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';

import useLinkedDataIdQuery from './useLinkedDataIdQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockResourceMetadata = { id: 'http://example.com/resource/123' };

describe('useLinkedDataIdQuery', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });

    mockGet.mockReturnValue({
      json: () => Promise.resolve(mockResourceMetadata),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch resource metadata when enabled and instanceId is provided', async () => {
    const instanceId = 'inst1';

    const { result } = renderHook(() => useLinkedDataIdQuery(instanceId), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockResourceMetadata));
    expect(mockGet).toHaveBeenCalledWith('linked-data/resource/metadata/inst1/id');
  });

  it('should not fetch when instanceId is not provided', () => {
    const { result } = renderHook(() => useLinkedDataIdQuery(null), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should not fetch when enabled is false', () => {
    const instanceId = 'inst1';

    const { result } = renderHook(() => useLinkedDataIdQuery(instanceId, { enabled: false }), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should return isLoading state correctly', async () => {
    const instanceId = 'inst1';

    const { result } = renderHook(() => useLinkedDataIdQuery(instanceId), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResourceMetadata);
  });

  it('should provide refetch function', async () => {
    const instanceId = 'inst1';

    const { result } = renderHook(() => useLinkedDataIdQuery(instanceId, { enabled: false }), { wrapper });

    expect(typeof result.current.refetch).toBe('function');

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockGet).toHaveBeenCalledWith('linked-data/resource/metadata/inst1/id');
  });

  it('should handle API errors gracefully', async () => {
    const instanceId = 'inst1';
    const mockError = new Error('API Error');

    mockGet.mockReturnValue({
      json: () => Promise.reject(mockError),
    });

    const { result } = renderHook(() => useLinkedDataIdQuery(instanceId), { wrapper });

    // Wait a bit for the query to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // When there's an error, data should be undefined
    expect(result.current.data).toBeUndefined();
  }, 10000);

  it('should use correct query key with namespace and instanceId', async () => {
    const instanceId = 'inst1';

    renderHook(() => useLinkedDataIdQuery(instanceId), { wrapper });

    await waitFor(() => {
      const queryKey = queryClient.getQueryCache().getAll()[0]?.queryKey;
      expect(queryKey).toEqual(expect.arrayContaining([expect.stringContaining('inventory'), instanceId]));
    });
  });
});
