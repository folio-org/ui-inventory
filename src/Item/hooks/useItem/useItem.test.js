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
});
