import '../../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import useItem from './useItem';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const itemId = 'itemId';

describe('useItem', () => {
  it('should fetch item', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: itemId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useItem(itemId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.item.id).toBe(itemId);
  });

  it('should sort the directly-linked bound-with title to the top', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: itemId,
          holdingsRecordId: 'bw456',
          boundWithTitles: [
            { briefHoldingsRecord: { id: 'bw123' } },
            { briefHoldingsRecord: { id: 'bw456' } }, // should sort to top
            { briefHoldingsRecord: { id: 'bw789' } },
          ],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useItem(itemId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    const firstSortedTitle = result.current.item.boundWithTitles[0];
    expect(firstSortedTitle.briefHoldingsRecord.id).toEqual(
      result.current.item.holdingsRecordId
    );
  });
});
