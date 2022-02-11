import { act, renderHook } from '@testing-library/react-hooks';

import useControlledAccordion from './useControlledAccordion';

describe('useControlledAccordion', () => {
  it('should return value with initial state', () => {
    const { result } = renderHook(() => useControlledAccordion(true));

    const { open } = result.current;

    expect(open).toBeTruthy();
  });

  it('should return value after initial update', () => {
    const { rerender, result } = renderHook(open => useControlledAccordion(open), {
      initialProps: false,
    });

    rerender(true);

    const { open } = result.current;

    expect(open).toBeTruthy();
  });

  it('should change value to opposite when toggle is called', () => {
    const { result } = renderHook(() => useControlledAccordion(false));

    const { onToggle } = result.current;

    act(() => {
      onToggle();
    });

    expect(result.current.open).toBeTruthy();
  });
});
