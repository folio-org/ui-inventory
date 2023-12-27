import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import useLocationsOfAllTenantsQuery from './useLocationsOfAllTenantsQuery';

jest.mock('../useConsortiumTenants/useConsortiumTenants', () => () => ({
  tenants: [{
    id: 'cs00000int',
  }, {
    id: 'cs00000int_0002',
  }],
  isLoading: false,
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLocationsOfAllTenantsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ locations: [{ id: 'location-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch locations of all tenants', async () => {
    const { result } = renderHook(() => useLocationsOfAllTenantsQuery(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([
      { id: 'location-id' },
      { id: 'location-id' },
    ]);
  });
});
