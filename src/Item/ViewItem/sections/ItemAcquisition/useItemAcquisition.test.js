import React, { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  order,
  orderLine,
  orderSetting,
  vendor,
  piece,
  resultData,
  finance,
} from './fixtures';

import useItemAcquisition from './useItemAcquisition';

const queryClient = new QueryClient();

const kyResponseMap = {
  'orders/pieces': { pieces: [piece] },
  [`orders/order-lines/${orderLine.id}`]: orderLine,
  [`orders/acquisition-methods/${orderLine.acquisitionMethod}`]: orderSetting,
  [`orders/composite-orders/${order.id}`]: order,
  [`organizations/organizations/${vendor.id}`]: vendor,
  [`finance/transactions?query=encumbrance.sourcePoLineId="${orderLine.id}"`]: finance,
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemAcquisition', () => {
  it('should fetch item acquisition data', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });

    const { result } = renderHook(() => useItemAcquisition('itemId'), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.itemAcquisition).toEqual(resultData);
  });

  describe('when acquisition data is empty', () => {
    describe('and user is non-central tenant', () => {
      it('should fetch acquisition data with central tenant id', async () => {
        useOkapiKy
          .mockClear()
          .mockReturnValue({
            get: () => ({
              json: () => ({}),
            }),
          });

        const { result } = renderHook(() => useItemAcquisition('itemId'), { wrapper });

        await act(() => {
          return !result.current.isLoading;
        });

        expect(useOkapiKy).toHaveBeenCalledWith({ tenant: 'consortia' });
      });
    });
  });
});
