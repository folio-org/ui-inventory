import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { boundWithHoldingsRecords } from '../Holding/ViewHolding/HoldingBoundWith/fixtures';
import useHoldingsQueryByHrids from './useHoldingsQueryByHrids';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useHoldingsQueryByHrids', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ holdingsRecords: boundWithHoldingsRecords }),
      }),
    });
  });

  it('should fetch holdings', async () => {
    const hrids = [{ hrid: 'BW-1' }];

    const { result } = renderHook(() => useHoldingsQueryByHrids(hrids), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.holdingsRecords).toEqual(boundWithHoldingsRecords);
  });
});
