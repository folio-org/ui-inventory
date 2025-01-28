import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useStripes } from '@folio/stripes/core';

import useInstance from './useInstance';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({
    hasInterface: () => false,
    okapi: { tenant: 'tenantId' },
    user: {},
  }),
}));

jest.mock('./useSearchInstanceByIdQuery', () => jest.fn());
jest.mock('./useInstanceQuery', () => jest.fn());

const TENANT_ID = 'tenantId';
const INSTANCE_ID_1 = 123;
const INSTANCE_ID_2 = 456;
const INSTANCE_NAME_1 = 'Test';
const INSTANCE_NAME_2 = 'Test 2';
const mockUseSearchInstanceByIdQuery = (shared = false) => {
  useSearchInstanceByIdQuery.mockReturnValue({
    instance: { shared, tenantId: TENANT_ID },
    isLoading: false,
  });
};

const mockUseInstanceQuery = (instance = {}) => {
  useInstanceQuery.mockReturnValueOnce({
    instance,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  });
};

describe('useInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch instance data and return the instance and loading status', async () => {
    mockUseSearchInstanceByIdQuery();
    mockUseInstanceQuery({ id: INSTANCE_ID_1, name: INSTANCE_NAME_1 });

    const { result } = renderHook(() => useInstance(INSTANCE_ID_1));

    const expectedInstance = {
      id: INSTANCE_ID_1,
      name: INSTANCE_NAME_1,
      shared: false,
      tenantId: TENANT_ID,
    };

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      instance: expectedInstance,
      isLoading: false,
      isFetching: false,
      refetch: expect.any(Function),
      isError: false,
      error: null,
    });
  });

  it('should re-fetch instance data if id changes', async () => {
    mockUseSearchInstanceByIdQuery();
    mockUseInstanceQuery({ id: INSTANCE_ID_1, name: INSTANCE_NAME_1 });
    mockUseInstanceQuery({ id: INSTANCE_ID_2, name: INSTANCE_NAME_2 });

    const { result, rerender } = renderHook(({ id }) => useInstance(id), {
      initialProps: { id: INSTANCE_ID_1 },
    });

    await waitFor(() => {
      expect(result.current.instance).toEqual({
        id: INSTANCE_ID_1,
        name: INSTANCE_NAME_1,
        shared: false,
        tenantId: TENANT_ID,
      });
    });

    rerender({ id: INSTANCE_ID_2 });

    await waitFor(() => {
      expect(result.current.instance).toEqual({
        id: INSTANCE_ID_2,
        name: INSTANCE_NAME_2,
        shared: false,
        tenantId: TENANT_ID,
      });
    });
  });

  it('should correctly handle consortium mode', async () => {
    const CENTRAL_TENANT_ID = 'centralTenant';

    useStripes.mockReturnValue({
      hasInterface: () => true,
      okapi: { tenant: TENANT_ID },
      user: { user: { consortium: { centralTenantId: CENTRAL_TENANT_ID } } },
    });

    mockUseSearchInstanceByIdQuery(true);
    mockUseInstanceQuery({ id: INSTANCE_ID_1, name: INSTANCE_NAME_1 });

    const { result } = renderHook(() => useInstance(INSTANCE_ID_1));

    await waitFor(() => {
      expect(result.current.instance).toEqual({
        id: INSTANCE_ID_1,
        name: INSTANCE_NAME_1,
        shared: true,
        tenantId: CENTRAL_TENANT_ID,
      });
    });
  });
});
