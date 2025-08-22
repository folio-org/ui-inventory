import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { items } from '../../test/fixtures/items';
import useHoldingItemsQuery from './useHoldingItemsQuery';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useHoldingItemsQuery', () => {
  const mockGet = jest.fn((_path, { searchParams }) => ({
    json: () => ({
      items: items.slice(searchParams.offset ?? 0, searchParams.limit),
      totalRecords: items.length,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      extend: jest.fn().mockReturnValue({ get: mockGet }),
    });
  });

  it('fetches holding items', async () => {
    const limit = 5;
    const id = items[0].holdingsRecordId;

    const { result } = renderHook(() => useHoldingItemsQuery(id, { searchParams: { limit } }), { wrapper });

    await act(() => !result.current.isFetching);

    expect(result.current.items).toEqual(items.slice(0, limit));
    expect(mockGet).toHaveBeenCalledWith(
      'inventory/items-by-holdings-id',
      {
        searchParams: {
          offset: 0,
          limit,
          query: `holdingsRecordId==${id} sortby barcode/sort.ascending`
        }
      }
    );
  });

  describe('when sortBy param is provided', () => {
    it('should fetch items with certain sortby param', async () => {
      const limit = 5;
      const id = items[0].holdingsRecordId;

      const { result } = renderHook(() => useHoldingItemsQuery(id, {
        searchParams: {
          limit,
          sortBy: '-status',
        }
      }), { wrapper });

      await act(() => !result.current.isFetching);

      expect(result.current.items).toEqual(items.slice(0, limit));
      expect(mockGet).toHaveBeenCalledWith(
        'inventory/items-by-holdings-id',
        {
          searchParams: {
            offset: 0,
            limit,
            query: `holdingsRecordId==${id} sortby status.name/sort.descending`
          }
        }
      );
    });
  });

  describe('when sortBy param is order', () => {
    it('should fetch items with order sortby param', async () => {
      const limit = 5;
      const id = items[0].holdingsRecordId;

      const { result } = renderHook(() => useHoldingItemsQuery(id, {
        searchParams: {
          limit,
          sortBy: 'order',
        }
      }), { wrapper });

      await act(() => !result.current.isFetching);

      expect(result.current.items).toEqual(items.slice(0, limit));
      expect(mockGet).toHaveBeenCalledWith(
        'inventory/items-by-holdings-id',
        {
          searchParams: {
            offset: 0,
            limit,
            query: `holdingsRecordId==${id} sortby order/number/sort.ascending`
          }
        }
      );
    });
  });
});
