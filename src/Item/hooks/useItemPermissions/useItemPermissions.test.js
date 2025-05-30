import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import useItemPermissions from './useItemPermissions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

const mockStripes = {
  hasPerm: jest.fn().mockReturnValue(true),
};

describe('useItemPermissions', () => {
  beforeEach(() => {
    useStripes.mockReturnValue(mockStripes);
  });

  it('should return item permissions', () => {
    const { result } = renderHook(() => useItemPermissions(false, []));

    expect(result.current).toEqual({
      canEdit: true,
      canCreate: true,
      canUpdateOwnership: false, // instance is not shared and tenants are empty
      canMarkAsMissing: true,
      canMarkAsWithdrawn: true,
      canDelete: true,
    });
  });
});
