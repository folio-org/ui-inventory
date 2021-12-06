import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { line, order, resultData, acqUnit } from './fixtures';
import useInstanceAcquisition from './useInstanceAcquisition';

const queryClient = new QueryClient();

const kyResponseMap = {
  'orders/order-lines': { poLines: [line] },
  'orders/composite-orders': { purchaseOrders: [order] },
  'acquisitions-units/units': { acquisitionsUnits: [acqUnit] },
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceAcquisition', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });
  });

  it('should fetch instance acquisition data', async () => {
    const { result, waitFor } = renderHook(() => useInstanceAcquisition('instanceId'), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.instanceAcquisition).toEqual(resultData);
  });
});
