import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useItemRequestsMutation from './useItemRequestsMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const mockKy = {
  put: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemRequestsMutation', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(mockKy);
  });

  it('should make a PUT request to update a request', async () => {
    const mockRequest = {
      id: 'request-123',
      status: 'Open',
    };
    const mockResponse = { ...mockRequest, updated: true };
    mockKy.put.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useItemRequestsMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateRequests(mockRequest);
    });

    expect(mockKy.put).toHaveBeenCalledWith(
      'circulation/requests/request-123',
      { json: mockRequest }
    );
  });

  it('should handle errors when updating a request', async () => {
    const mockRequest = {
      id: 'request-123',
      status: 'Open',
    };
    const mockError = new Error('Network error');
    mockKy.put.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useItemRequestsMutation(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateRequests(mockRequest);
      } catch (error) {
        expect(error.message).toBe('Failed to update request: Network error');
      }
    });

    expect(mockKy.put).toHaveBeenCalledWith(
      'circulation/requests/request-123',
      { json: mockRequest }
    );
  });

  it('should return error state when mutation fails', async () => {
    const mockRequest = {
      id: 'request-123',
      status: 'Open',
    };
    const mockError = new Error('Network error');
    mockKy.put.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useItemRequestsMutation(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateRequests(mockRequest);
      } catch (error) {
        expect(error.message).toBe('Failed to update request: Network error');
      }
    });

    expect(result.current.mutationError).toBeTruthy();
  });
});
