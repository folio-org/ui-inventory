import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import useLocationsForTenants from './useLocationsForTenants';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLocationsForTenants', () => {
  const mockGet = jest.fn().mockReturnValue({
    json: () => Promise.resolve({ locations: [{ id: 'location-id' }] }),
  });

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const tenantIds = ['cs00000int', 'cs00000int_0002'];

  it('should fetch locations of all tenants', async () => {
    const { result } = renderHook(() => useLocationsForTenants({ tenantIds }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([
      { id: 'location-id' },
      { id: 'location-id' },
    ]);
  });

  describe('when tenantIds is empty', () => {
    it('should not make a request', () => {
      renderHook(() => useLocationsForTenants({ tenantIds: [] }), { wrapper });

      expect(mockGet).not.toHaveBeenCalled();
    });
  });
});
