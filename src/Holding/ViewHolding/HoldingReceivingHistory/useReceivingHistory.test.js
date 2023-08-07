import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { piece, receivingHistory } from './fixtures';
import useReceivingHistory from './useReceivingHistory';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useReceivingHistory', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ pieces: [piece] }),
      }),
    });
  });

  it('should return receiving history based on pieces and holding history', async () => {
    const holding = { id: 'holdingId', receivingHistory: { entries: [receivingHistory[0]] } };
    const { result } = renderHook(() => useReceivingHistory(holding), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.receivingHistory).toEqual(receivingHistory);
  });
});
