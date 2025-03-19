import React, { act } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import useItemAuditDataQuery from './useItemAuditDataQuery';

// Mock the dependencies
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const mockItemId = '123';
const mockAuditData = {
  totalRecords: 3,
  inventoryAuditItems: [
    { eventTs: '2024-03-20T10:00:00Z', id: '1' },
    { eventTs: '2024-03-20T09:00:00Z', id: '2' },
  ],
};

const mockKy = {
  get: jest.fn().mockReturnValue({
    json: () => Promise.resolve(mockAuditData),
  }),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemAuditDataQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      ...mockKy,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch audit data when instanceId is provided', async () => {
    const { result } = renderHook(
      () => useItemAuditDataQuery(mockItemId),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await act(() => !result.current.isLoading);

    await waitFor(() => {
      expect(mockKy.get).toHaveBeenCalledWith(
        `audit-data/inventory/item/${mockItemId}`,
        expect.any(Object)
      );
      expect(result.current.data).toEqual(mockAuditData.inventoryAuditItems);
      expect(result.current.totalRecords).toBe(mockAuditData.totalRecords);
    });
  });

  it('should not fetch data when instanceId is not provided', () => {
    const { result } = renderHook(
      () => useItemAuditDataQuery(null),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockKy.get).not.toHaveBeenCalled();
  });

  it('should handle fetchNextPage correctly', async () => {
    const secondPageData = {
      totalRecords: 3,
      inventoryAuditItems: [
        { eventTs: '2024-03-20T08:00:00Z', id: '3' },
      ],
    };

    useOkapiKy
      .mockClear()
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(mockAuditData),
        }),
      })
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(secondPageData),
        }),
      });

    const { result } = renderHook(
      () => useItemAuditDataQuery(mockItemId),
      { wrapper }
    );

    await act(() => !result.current.isLoading);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(3);
      expect(result.current.isLoadingMore).toBe(false);
    });
  });

  it('should set hasNextPage to false when all records are fetched', async () => {
    const singlePageData = {
      totalRecords: 2,
      inventoryAuditItems: [
        { eventTs: '2024-03-20T10:00:00Z', id: '1' },
        { eventTs: '2024-03-20T09:00:00Z', id: '2' },
      ],
    };

    useOkapiKy
      .mockClear()
      .mockReturnValueOnce({
        get: () => ({
          json: () => Promise.resolve(singlePageData),
        }),
      });

    const { result } = renderHook(
      () => useItemAuditDataQuery(mockItemId),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasNextPage).toBe(false);
    });
  });
});
