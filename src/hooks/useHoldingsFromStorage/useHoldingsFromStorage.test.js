import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import useHoldingsFromStorage from './useHoldingsFromStorage';

jest.mock('use-session-storage-state', () => () => [{ 'accordion': false }, () => {}]);

describe('useHoldingsFromStorage', () => {
  it('should return state from session storage', () => {
    const { result } = renderHook(() => useHoldingsFromStorage({ defaultValue: {} }));

    expect(result.current[0]).toEqual({ 'accordion': false });
  });
});
