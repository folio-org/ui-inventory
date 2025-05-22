import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import useItemStatusChecks from './useItemStatusChecks';

import {
  canMarkItemAsMissing,
  canMarkItemAsWithdrawn,
  canMarkItemWithStatus,
  canCreateNewRequest,
} from '../../../utils';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  canMarkItemAsMissing: jest.fn(),
  canMarkItemAsWithdrawn: jest.fn(),
  canMarkItemWithStatus: jest.fn(),
  canCreateNewRequest: jest.fn(),
}));

const mockItem = { id: '123', status: { name: 'Available' } };
const mockStripes = { hasPerm: jest.fn() };

describe('useItemStatusChecks', () => {
  beforeEach(() => {
    useStripes.mockReturnValue(mockStripes);
    canMarkItemAsMissing.mockReturnValue(true);
    canMarkItemAsWithdrawn.mockReturnValue(true);
    canMarkItemWithStatus.mockReturnValue(true);
    canCreateNewRequest.mockReturnValue(true);
  });

  it('should return an object with status check functions', () => {
    const { result } = renderHook(() => useItemStatusChecks(mockItem));

    expect(result.current).toEqual({
      canMarkItemAsMissing: true,
      canMarkItemAsWithdrawn: true,
      canMarkItemWithStatus: true,
      canCreateNewRequest: true,
    });
  });

  it('should call utility functions with correct parameters', () => {
    renderHook(() => useItemStatusChecks(mockItem));

    expect(canMarkItemAsMissing).toHaveBeenCalledWith(mockItem);
    expect(canMarkItemAsWithdrawn).toHaveBeenCalledWith(mockItem);
    expect(canMarkItemWithStatus).toHaveBeenCalledWith(mockItem);
    expect(canCreateNewRequest).toHaveBeenCalledWith(mockItem, mockStripes);
  });
});
