import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import useConsortiumHoldings from './useConsortiumHoldings';
import { useTenantKy } from '../../common';

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumHoldings', () => {
  beforeEach(() => {
    useTenantKy.mockClear().mockReturnValue({
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
