import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import useConsortiumHoldings from './useConsortiumHoldings';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumHoldings', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ holdings: [{ id: 'holdings-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch holdings', async () => {
    const { result } = renderHook(() => useConsortiumHoldings('instanceId', 'college'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.holdings).toEqual([{ id: 'holdings-id' }]);
  });
});
