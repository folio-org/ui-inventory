import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  checkIfUserInCentralTenant,
} from '@folio/stripes/core';

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

  describe('when user is in a member tenant', () => {
    it('should fetch locations of all tenants via multiple requests', async () => {
      const { result } = renderHook(() => useLocationsForTenants({ tenantIds }), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet.mock.calls[0][0]).toBe('locations');
      expect(mockGet.mock.calls[1][0]).toBe('locations');
      expect(result.current.data).toEqual([
        { id: 'location-id' },
        { id: 'location-id' },
      ]);
    });

    it('should not call consolidated locations endpoint', async () => {
      const { result } = renderHook(() => useLocationsForTenants({ tenantIds }), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet).not.toHaveBeenCalledWith('search/consortium/locations');
    });

    describe('when tenantIds is empty', () => {
      it('should not make a request', () => {
        renderHook(() => useLocationsForTenants({ tenantIds: [] }), { wrapper });

        expect(mockGet).not.toHaveBeenCalled();
      });
    });
  });

  describe('when user is in a central tenant', () => {
    beforeEach(() => {
      checkIfUserInCentralTenant.mockClear().mockReturnValue(true);
    });

    it('should fetch locations of all tenants via consolidated endpoint', async () => {
      const { result } = renderHook(() => useLocationsForTenants({ tenantIds }), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet).toHaveBeenCalledWith('search/consortium/locations');

      expect(result.current.data).toEqual([
        { id: 'location-id' },
      ]);
    });

    it('should not call multiple locations endpoints', async () => {
      const { result } = renderHook(() => useLocationsForTenants({ tenantIds }), { wrapper });

      await act(() => !result.current.isLoading);

      expect(mockGet).not.toHaveBeenCalledWith('locations');
    });
  });
});
