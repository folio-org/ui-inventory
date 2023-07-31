import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { boundWithItems } from './fixtures';
import useBoundWithItems from './useBoundWithItems';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBoundWithItems', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ items: boundWithItems }),
      }),
    });
  });

  it('should fetch bound-with items', async () => {
    const boundWithParts = [{ itemId: 'f4b8c3d1-f461-4551-aa7b-5f45e64f236c' }];

    const { result } = renderHook(() => useBoundWithItems(boundWithParts), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.boundWithItems).toEqual(boundWithItems);
  });

  it('should not fetch bound-with items', async () => {
    const { result } = renderHook(() => useBoundWithItems([]), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.boundWithItems).toEqual([]);
  });
});
