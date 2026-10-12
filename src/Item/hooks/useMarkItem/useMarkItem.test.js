import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useMarkItem from './useMarkItem';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const mockKy = {
  post: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMarkItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockReturnValue(mockKy);
  });

  it('should mark item as missing successfully', async () => {
    const mockResponse = { status: 200 };
    mockKy.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMarkItem(), { wrapper });

    await act(async () => {
      await result.current.markItemAs({
        itemId: 'item-123',
        markAs: 'mark-missing',
      });
    });

    expect(mockKy.post).toHaveBeenCalledWith(
      'inventory/items/item-123/mark-missing',
      { json: {} }
    );
    expect(result.current.isMarking).toBe(false);
    expect(result.current.markingError).toBeNull();
  });

  it('should mark item as withdrawn with additional body data', async () => {
    const mockResponse = { status: 200 };
    const mockBody = { reason: 'Damaged' };
    mockKy.post.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMarkItem(), { wrapper });

    await act(async () => {
      await result.current.markItemAs({
        itemId: 'item-123',
        markAs: 'mark-withdrawn',
        body: mockBody,
      });
    });

    expect(mockKy.post).toHaveBeenCalledWith(
      'inventory/items/item-123/mark-withdrawn',
      { json: mockBody }
    );
    expect(result.current.isMarking).toBe(false);
    expect(result.current.markingError).toBeNull();
  });

  it('should handle API error when marking item', async () => {
    const mockError = new Error('API Error');
    mockKy.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMarkItem(), { wrapper });

    await act(async () => {
      try {
        await result.current.markItemAs({
          itemId: 'item-123',
          markAs: 'mark-missing',
        });
      } catch (error) {
        expect(error.message).toBe('Failed to mark item as mark-missing: API Error');
      }
    });

    expect(mockKy.post).toHaveBeenCalledWith(
      'inventory/items/item-123/mark-missing',
      { json: {} }
    );
    expect(result.current.isMarking).toBe(false);
  });
});
