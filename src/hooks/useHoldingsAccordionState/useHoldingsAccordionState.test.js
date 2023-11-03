import {
  renderHook,
  waitFor,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import useHoldingsAccordionState from './useHoldingsAccordionState';

import { getItem } from '../../storage';

describe('useHoldingsAccordionState', () => {
  it('should save initial holdings state in storage', () => {
    const { result } = renderHook(() => useHoldingsAccordionState({
      instanceId: 'instanceId',
      pathToAccordion: ['holdings', '_self'],
    }));

    const expectedResult = { instanceId: { holdings: { _self: false } } };

    expect(getItem('@folio/inventory.instanceHoldingsAccordionsState')).toEqual(expectedResult);
    expect(result.current[0]).toEqual(false);
  });

  it('should set new state on accordion toggle', () => {
    const { result } = renderHook(() => useHoldingsAccordionState({
      instanceId: 'instanceId',
      pathToAccordion: ['holdings', '_self'],
    }));

    const [isOpen, setOpen] = result.current;

    act(() => {
      setOpen(true);
    });

    const expectedResult = { instanceId: { holdings: { _self: true } } };

    waitFor(() => expect(isOpen).toBeTruthy());
    waitFor(() => expect(getItem('@folio/inventory.instanceHoldingsAccordionsState')).toEqual(expectedResult));
  });
});
