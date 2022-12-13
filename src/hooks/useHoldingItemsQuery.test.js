import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useHoldingItemsQuery(id, { searchParams: { limit } }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.items).toEqual(items.slice(0, limit));
    expect(mockGet).toHaveBeenCalledWith(
      'inventory/items-by-holdings-id',
      {
        searchParams: {
          limit,
          query: `holdingsRecordId==${id}`
        }
      }
    );
  });
});
