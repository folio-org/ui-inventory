import '../../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useHolding from './useHolding';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const holdingId = 'holdingId';

describe('useHolding', () => {
  it('should fetch holding', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: holdingId,
        }),
      }),
    });

    const { result } = renderHook(() => useHolding(holdingId), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.holding.id).toBe(holdingId);
  });
});
