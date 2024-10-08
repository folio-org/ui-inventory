import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useCentralOrderingSettings } from '@folio/stripes-acq-components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { extendKyWithTenant } from '../../../Instance/utils';
import useBoundPieces from './useBoundPieces';
import { isUserInConsortiumMode } from '../../../utils';

jest.mock('@folio/stripes-acq-components', () => ({
  getConsortiumCentralTenantId: jest.fn(() => 'central-tenant'),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(() => ['bound-pieces']),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

jest.mock('../../../Instance/utils', () => ({
  extendKyWithTenant: jest.fn(),
}));

jest.mock('../../../utils', () => ({
  isUserInConsortiumMode: jest.fn(() => false),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockKy = {
  get: jest.fn(() => ({
    json: jest.fn().mockResolvedValue({
      pieces: [{ id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z' }],
      totalRecords: 1,
    }),
  })),
};

const mockStripes = {
  okapi: { tenant: 'member-tenant' },
  hasInterface: jest.fn(() => true),
};

describe('useBoundPieces', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockReturnValue(mockKy);
    useStripes.mockReturnValue(mockStripes);
  });

  it('should return default data when query is not enabled', () => {
    const itemId = null;
    const { result } = renderHook(() => useBoundPieces(itemId), { wrapper });

    expect(result.current.boundPieces).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('should handle central ordering logic when central ordering is enabled', async () => {
    isUserInConsortiumMode.mockReturnValue(true);

    const itemId = '12345';
    const extendedKy = {
      get: jest.fn(() => ({
        json: jest.fn().mockResolvedValue({
          pieces: [{ id: 'piece2', receivedDate: '2023-02-01T00:00:00.000Z' }],
          totalRecords: 1,
        }),
      })),
    };

    useCentralOrderingSettings.mockReturnValue({ enabled: true, isFetching: false });
    extendKyWithTenant.mockReturnValue(extendedKy);

    const { result } = renderHook(() => useBoundPieces(itemId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.boundPieces).toEqual([
      { id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z', tenantId: 'member-tenant' },
      { id: 'piece2', receivedDate: '2023-02-01T00:00:00.000Z', tenantId: 'central-tenant' },
    ]);
  });
});
