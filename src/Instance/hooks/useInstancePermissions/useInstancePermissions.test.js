import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  checkIfUserInCentralTenant,
  checkIfUserInMemberTenant,
  useStripes
} from '@folio/stripes/core';

import useInstancePermissions from './useInstancePermissions';
import useInstanceHoldingsQuery from '../useInstanceHoldingsQuery';
import useCentralOrderingSettingsQuery from '../../../hooks/useCentralOrderingSettingsQuery';
import {
  checkIfCentralOrderingIsActive,
  isInstanceShadowCopy,
  isMARCSource,
} from '../../../utils';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  checkIfUserInCentralTenant: jest.fn(),
  checkIfUserInMemberTenant: jest.fn(),
  useStripes: jest.fn(),
}));
jest.mock('../useInstanceHoldingsQuery');
jest.mock('../../../hooks/useCentralOrderingSettingsQuery');
jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  checkIfCentralOrderingIsActive: jest.fn(),
  isInstanceShadowCopy: jest.fn(),
  isMARCSource: jest.fn(),
}));

const defaultInstance = { id: 'inst1', source: 'FOLIO' };
const defaultStripes = {
  hasPerm: jest.fn(() => true),
  hasInterface: jest.fn(() => true),
  user: { user: { consortium: { centralTenantId: 'central' } } },
  okapi: { tenant: 'tenant' },
};

describe('useInstancePermissions', () => {
  beforeEach(() => {
    useStripes.mockReturnValue(defaultStripes);
    useInstanceHoldingsQuery.mockReturnValue({ totalRecords: 1 });
    useCentralOrderingSettingsQuery.mockReturnValue({ data: { settings: [{ value: 'true' }] } });
    checkIfUserInCentralTenant.mockReturnValue(false);
    checkIfUserInMemberTenant.mockReturnValue(false);
    checkIfCentralOrderingIsActive.mockReturnValue(true);
    isInstanceShadowCopy.mockReturnValue(false);
    isMARCSource.mockReturnValue(false);
  });

  it('should return all permissions as true for default mocks', () => {
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.canEditInstance).toBe(true);
    expect(result.current.canCreateInstance).toBe(true);
    expect(result.current.canCreateRequest).toBe(true);
    expect(result.current.canMoveItems).toBe(true);
    expect(result.current.canCreateOrder).toBe(true);
    expect(result.current.showInventoryMenuSection).toBe(true);
  });

  it('should return canMoveItems as false if user is in central tenant', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.canMoveItems).toBe(false);
  });

  it('should return canMoveItems as false if there are no holdings', () => {
    useInstanceHoldingsQuery.mockReturnValue({ totalRecords: 0 });
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.canMoveItems).toBe(false);
  });

  it('should return canCreateOrder as true for central tenant if central ordering is active', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    checkIfCentralOrderingIsActive.mockReturnValue(true);
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.canCreateOrder).toBe(true);
  });

  it('should return canCreateOrder as false for central tenant if central ordering is not active', () => {
    checkIfUserInCentralTenant.mockReturnValue(true);
    checkIfCentralOrderingIsActive.mockReturnValue(false);
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.canCreateOrder).toBe(false);
  });

  it('should return showQuickMarcMenuSection as true if isSourceMARC is true and canCreateMARCHoldings is true', () => {
    isMARCSource.mockReturnValue(true);
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance }));

    expect(result.current.showQuickMarcMenuSection).toBe(true);
  });

  it('should return showLinkedDataMenuSection as true if canAccessLinkedDataOptions and isSourceLinkedData', () => {
    defaultStripes.hasPerm = jest.fn((perm) => perm === 'linked-data.resources.bib.post');
    const { result } = renderHook(() => useInstancePermissions({ instance: defaultInstance, isSourceLinkedData: true }));

    expect(result.current.showLinkedDataMenuSection).toBe(true);
  });
});
