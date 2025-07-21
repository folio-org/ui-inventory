import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useSetRecordForDeletion from './useSetRecordForDeletion';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSetRecordForDeletion', () => {
  beforeEach(() => {
    useOkapiKy.mockClear();
  });

  it('should call delete with the correct URL and handle success', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    useOkapiKy.mockReturnValue({ delete: mockDelete });

    const { result } = renderHook(() => useSetRecordForDeletion('test-tenant'), { wrapper });

    await act(async () => {
      await result.current.setRecordForDeletion('instance-123');
    });

    expect(mockDelete).toHaveBeenCalledWith('inventory/instances/instance-123/mark-deleted');
    expect(result.current.isSetting).toBe(false);
    expect(result.current.setError).toBeNull();
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to delete');
    const mockDelete = jest.fn().mockRejectedValue(error);
    useOkapiKy.mockReturnValue({ delete: mockDelete });

    const { result } = renderHook(() => useSetRecordForDeletion('test-tenant'), { wrapper });

    await act(async () => {
      try {
        await result.current.setRecordForDeletion('instance-123');
      } catch (e) {}
    });

    expect(mockDelete).toHaveBeenCalledWith('inventory/instances/instance-123/mark-deleted');
    expect(result.current.isSetting).toBe(false);
    expect(result.current.setError).toBe(error);
  });
});
