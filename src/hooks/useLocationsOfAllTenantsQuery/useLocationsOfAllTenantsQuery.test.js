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

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const tenantIds = [
  'cs00000int',
  'cs00000int_0002'
];

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
    const { result } = renderHook(() => useLocationsOfAllTenantsQuery({ enabled: true, tenantIds }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([
      { id: 'location-id' },
      { id: 'location-id' },
    ]);
  });
});
