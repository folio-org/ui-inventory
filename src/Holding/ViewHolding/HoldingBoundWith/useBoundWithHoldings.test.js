import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { boundWithHoldingsRecords } from './fixtures';
import useBoundWithHoldings from './useBoundWithHoldings';
import { useTenantKy } from '../../../common';

jest.mock('../../../common', () => ({
  ...jest.requireActual('../../../common'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBoundWithHoldings', () => {
  beforeEach(() => {
    useTenantKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ holdingsRecords: boundWithHoldingsRecords }),
      }),
    });
  });

  it('should fetch bound-with holdings', async () => {
    const boundWithItems = [{ hrid: 'BW-ITEM-1', holdingsRecordId: '9e8dc8ce-68f3-4e75-8479-d548ce521157' }];

    const { result } = renderHook(() => useBoundWithHoldings(boundWithItems, 'testTenantId'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.boundWithHoldings).toEqual(boundWithHoldingsRecords);
  });

  it('should not fetch bound-with holdings', async () => {
    const { result } = renderHook(() => useBoundWithHoldings([], 'testTenantId'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.boundWithHoldings).toEqual([]);
  });
});
