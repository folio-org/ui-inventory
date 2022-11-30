import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitFor } = renderHook(() => useBoundWithItems(boundWithParts), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.boundWithItems).toEqual(boundWithItems);
  });
});
