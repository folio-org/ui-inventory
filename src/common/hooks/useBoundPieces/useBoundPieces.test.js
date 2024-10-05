import { useQuery } from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  getConsortiumCentralTenantId,
  useCentralOrderingSettings,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useBoundPieces from './useBoundPieces';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  getConsortiumCentralTenantId: jest.fn(),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

jest.mock('../../../Instance/utils', () => ({
  extendKyWithTenant: jest.fn(),
}));

describe('useBoundPieces', () => {
  const mockKy = {
    get: jest.fn(() => ({
      json: jest.fn(),
    })),
  };

  const mockStripes = {
    okapi: { tenant: 'member-tenant' },
    hasInterface: jest.fn(() => true),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockReturnValue(mockKy);
    useStripes.mockReturnValue(mockStripes);
    useNamespace.mockReturnValue(['bound-pieces']);
  });

  it('should return default data when query is not enabled', async () => {
    const itemId = null; // Query won't be enabled
    const mockQuery = {
      data: null,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    };

    useQuery.mockReturnValue(mockQuery);

    const { result } = renderHook(() => useBoundPieces(itemId));

    expect(result.current.boundPieces).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it('should fetch bound pieces for the given item ID', async () => {
    const itemId = '12345';
    const mockQuery = {
      data: {
        pieces: [{ id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z' }],
        totalRecords: 1,
      },
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    };

    useQuery.mockReturnValue(mockQuery);
    getConsortiumCentralTenantId.mockReturnValue('central-tenant');
    useCentralOrderingSettings.mockReturnValue({ enabled: true, isFetching: false });

    const { result } = renderHook(() => useBoundPieces(itemId));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.boundPieces).toEqual([{ id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z' }]);
    expect(result.current.isFetching).toBe(false);
  });

  it('should handle central ordering logic when central ordering is enabled', async () => {
    const itemId = '12345';
    const mockQuery = {
      data: {
        pieces: [
          { id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z', tenantId: 'member-tenant' },
          { id: 'piece2', receivedDate: '2023-02-01T00:00:00.000Z', tenantId: 'central-tenant' }
        ],
        totalRecords: 2,
      },
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    };

    useQuery.mockReturnValue(mockQuery);
    getConsortiumCentralTenantId.mockReturnValue('central-tenant');
    useCentralOrderingSettings.mockReturnValue({ enabled: true, isFetching: false });

    const { result } = renderHook(() => useBoundPieces(itemId));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.boundPieces).toEqual([
      { id: 'piece1', receivedDate: '2023-01-01T00:00:00.000Z', tenantId: 'member-tenant' },
      { id: 'piece2', receivedDate: '2023-02-01T00:00:00.000Z', tenantId: 'central-tenant' },
    ]);
  });

  it('should handle loading state correctly', async () => {
    const itemId = '12345';
    const mockQuery = {
      data: null,
      isLoading: true,
      isFetching: true,
      refetch: jest.fn(),
    };

    useQuery.mockReturnValue(mockQuery);
    getConsortiumCentralTenantId.mockReturnValue('central-tenant');
    useCentralOrderingSettings.mockReturnValue({ enabled: true, isFetching: false });

    const { result } = renderHook(() => useBoundPieces(itemId));

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    expect(result.current.boundPieces).toEqual([]);
    expect(result.current.isFetching).toBe(true);
  });
});
