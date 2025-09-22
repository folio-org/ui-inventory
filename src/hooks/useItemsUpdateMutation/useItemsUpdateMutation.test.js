import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy, useNamespace, CalloutContext } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import useItemsUpdateMutation from './useItemsUpdateMutation';

const queryClient = new QueryClient();

const mockCallout = {
  sendCallout: jest.fn(),
};

const wrapper = ({ children }) => (
  <CalloutContext.Provider value={mockCallout}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </CalloutContext.Provider>
);

describe('useItemsUpdateMutation', () => {
  const mockKy = {
    patch: jest.fn(),
  };

  const mockItems = [
    {
      id: 'item-1',
      _version: '1',
      holdingId: 'holding-1',
      order: '1',
    },
    {
      id: 'item-2',
      _version: '1',
      holdingId: 'holding-2',
      order: '2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockReturnValue(mockKy);
    useNamespace.mockReturnValue(['itemsByHoldingId']);
    queryClient.clear();
  });

  it('should return mutateAsync function', () => {
    const { result } = renderHook(
      () => useItemsUpdateMutation(),
      { wrapper },
    );

    expect(result.current).toHaveProperty('mutateAsync');
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('should make patch request with correct data when mutateAsync is called', async () => {
    const mockResponse = { success: true };
    const patchMock = jest.fn().mockReturnValue({ json: () => Promise.resolve(mockResponse) });
    mockKy.patch = patchMock;

    const { result } = renderHook(
      () => useItemsUpdateMutation(),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({ items: mockItems });
    });

    expect(patchMock).toHaveBeenCalledWith('item-storage/items', {
      json: {
        items: [
          {
            id: 'item-1',
            _version: '1',
            order: '1',
          },
          {
            id: 'item-2',
            _version: '1',
            order: '2',
          },
        ],
      },
    });
  });

  it('should remove holdingId from items before sending request', async () => {
    const mockResponse = { success: true };
    const patchMock = jest.fn().mockReturnValue({ json: () => Promise.resolve(mockResponse) });
    mockKy.patch = patchMock;

    const { result } = renderHook(
      () => useItemsUpdateMutation(),
      { wrapper },
    );

    const itemsWithHoldingId = [
      {
        id: 'item-1',
        _version: '1',
        holdingId: 'holding-1',
        order: '1',
      },
    ];

    await act(async () => {
      await result.current.mutateAsync({ items: itemsWithHoldingId });
    });

    expect(patchMock).toHaveBeenCalledWith('item-storage/items', {
      json: {
        items: [
          {
            id: 'item-1',
            _version: '1',
            order: '1',
          },
        ],
      },
    });
  });

  it('should invalidate queries for updated holdings on successful mutation', async () => {
    const mockResponse = { success: true };
    const patchMock = jest.fn().mockReturnValue({ json: () => Promise.resolve(mockResponse) });
    mockKy.patch = patchMock;

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useItemsUpdateMutation(),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({ items: mockItems });
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['itemsByHoldingId', 'items', 'holding-1'],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['itemsByHoldingId', 'items', 'holding-2'],
    });
  });

  it('should not invalidate queries for items without holdingId', async () => {
    const mockResponse = { success: true };
    const patchMock = jest.fn().mockReturnValue({ json: () => Promise.resolve(mockResponse) });
    mockKy.patch = patchMock;

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useItemsUpdateMutation(),
      { wrapper },
    );

    const itemsWithoutHoldingId = [
      {
        id: 'item-1',
        _version: '1',
        order: '1',
      },
    ];

    await act(async () => {
      await result.current.mutateAsync({ items: itemsWithoutHoldingId });
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
