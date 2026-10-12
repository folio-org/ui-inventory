import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import useMemberTenantHoldings from './useMemberTenantHoldings';
import { useInstanceHoldingsQuery } from '../../providers';
import useConsortiumHoldings from '../useConsortiumHoldings';

jest.mock('../../providers', () => ({
  ...jest.requireActual('../../providers'),
  useInstanceHoldingsQuery: jest.fn(),
}));
jest.mock('../useConsortiumHoldings', () => jest.fn());

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMemberTenantHoldings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return expanded holdings', async () => {
    useInstanceHoldingsQuery.mockClear().mockReturnValue({ holdingsRecords: [{ id: 'expandedHoldingsId' }], isLoading: false });
    useConsortiumHoldings.mockClear().mockReturnValue({ holdings: undefined, isLoading: false });

    const { result } = renderHook(() => useMemberTenantHoldings({ id: 'instanceId' }, 'college', [{ tenant: 'college', permissions: [] }]), { wrapper });

    await act(() => !result.current.isLoading);

    await waitFor(() => expect(result.current.holdings).toEqual([{ id: 'expandedHoldingsId' }]));
  });

  it('should return limited holdings', async () => {
    useInstanceHoldingsQuery.mockClear().mockReturnValue({ holdingsRecords: undefined, isLoading: false });
    useConsortiumHoldings.mockClear().mockReturnValue({ holdings: [{ id: 'limitedHoldingsId' }], isLoading: false });

    const { result } = renderHook(() => useMemberTenantHoldings({ id: 'instanceId' }, 'college', [{ tenant: 'college', permissions: [] }]), { wrapper });

    await act(() => !result.current.isLoading);

    await waitFor(() => expect(result.current.holdings).toEqual([{ id: 'limitedHoldingsId' }]));
  });
});
