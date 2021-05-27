import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { holdingSummaries } from './fixtures';
import useHoldingOrderLines from './useHoldingOrderLines';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useHoldingOrderLines', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ holdingSummaries }),
      }),
    });
  });

  it('should fetch holding order lines', async () => {
    const { result, waitFor } = renderHook(() => useHoldingOrderLines('holdingUid'), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.holdingOrderLines).toEqual(holdingSummaries);
  });
});
