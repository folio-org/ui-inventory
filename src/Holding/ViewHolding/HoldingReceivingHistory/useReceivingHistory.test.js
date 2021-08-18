import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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
    const { result, waitFor } = renderHook(() => useReceivingHistory(holding), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.receivingHistory).toEqual(receivingHistory);
  });
});
