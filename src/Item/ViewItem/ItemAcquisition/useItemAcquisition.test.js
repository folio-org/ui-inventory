import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { order, orderLine, vendor, piece, resultData } from './fixtures';
import useItemAcquisition from './useItemAcquisition';

const queryClient = new QueryClient();

const kyResponseMap = {
  'orders/pieces': { pieces: [piece] },
  [`orders/order-lines/${orderLine.id}`]: orderLine,
  [`orders/composite-orders/${order.id}`]: order,
  [`organizations/organizations/${vendor.id}`]: vendor,
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemAcquisition', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });
  });

  it('should fetch item acquisition data', async () => {
    const { result, waitFor } = renderHook(() => useItemAcquisition('itemId'), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.itemAcquisition).toEqual(resultData);
  });
});
