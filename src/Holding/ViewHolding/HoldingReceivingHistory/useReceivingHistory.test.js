import React, { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import { piece, receivingHistory } from './fixtures';
import useReceivingHistory from './useReceivingHistory';

const holdingWithReceivingHistory = {
  id: 'holdingId',
  receivingHistory: { entries: [receivingHistory[0]] },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useReceivingHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ pieces: [piece] }),
      }),
    });

    useStripes.mockReturnValue({
      user: { user: { consortium: { centralTenantId: 'centralTenantId' } } },
      hasInterface: () => true,
    });
  });

  it('should return receiving history based on pieces and holding history', async () => {
    const { result } = renderHook(() => useReceivingHistory(holdingWithReceivingHistory), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.receivingHistory).toEqual(receivingHistory);
  });

  describe('when user is central tenant', () => {
    it('should return receiving history based on pieces from API', async () => {
      const holdingWithoutReceivingHistory = {
        id: 'holdingId',
        receivingHistory: {},
      };

      const { result } = renderHook(
        () => useReceivingHistory(holdingWithoutReceivingHistory, 'centralTenantId'),
        { wrapper },
      );

      await act(() => !result.current.isFetching);

      expect(result.current.receivingHistory).toEqual([
        { ...piece, source: 'receiving' },
      ]);
    });
  });

  describe('when user is member tenant', () => {
    it('should return receiving history based on pieces and holding history', async () => {
      const { result } = renderHook(
        () => useReceivingHistory(holdingWithReceivingHistory, 'memberTenantId'),
        { wrapper },
      );

      await act(() => !result.current.isFetching);

      expect(result.current.receivingHistory).toEqual(receivingHistory);
    });
  });
});
