import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

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
    const { result } = renderHook(() => useHoldingOrderLines('holdingUid'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.holdingOrderLines).toEqual(holdingSummaries);
  });
});
