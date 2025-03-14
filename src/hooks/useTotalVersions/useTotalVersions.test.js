import { act } from 'react';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import useTotalVersions from './useTotalVersions';

describe('useTotalVersions', () => {
  it('should initialize with 0', () => {
    const { result } = renderHook(() => useTotalVersions());
    expect(result.current[0]).toBe(0);
  });

  it('should update totalVersions when totalRecords changes', () => {
    const { result, rerender } = renderHook(({ totalRecords }) => useTotalVersions(totalRecords), {
      initialProps: { totalRecords: undefined },
    });

    expect(result.current[0]).toBe(0);

    rerender({ totalRecords: 5 });
    expect(result.current[0]).toBe(5);
  });

  it('should not update if totalRecords is undefined', () => {
    const { result, rerender } = renderHook(({ totalRecords }) => useTotalVersions(totalRecords), {
      initialProps: { totalRecords: 5 },
    });

    expect(result.current[0]).toBe(5);

    rerender({ totalRecords: undefined });
    expect(result.current[0]).toBe(5);
  });

  it('should manually update totalVersions using setTotalVersions', () => {
    const { result } = renderHook(() => useTotalVersions(3));

    expect(result.current[0]).toBe(3);

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
  });
});
