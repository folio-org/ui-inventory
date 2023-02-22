import React from 'react';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useConfirmationModal } from './useConfirmationModal';

describe('useConfirmationModal', () => {
  it('should return initial result value falsy', async () => {
    const { result } = renderHook(() => useConfirmationModal());
    const { open } = result.current;
    expect(open).toBeFalsy();
  });
  it('should return result value truthy if it is rerender', () => {
    const { result, rerender } = renderHook(() => useConfirmationModal());
    rerender();
    expect(result.current).toBeTruthy();
  });

  it('should return wait promise value tobetruthy', () => {
    const { result, rerender } = renderHook(() => useConfirmationModal());
    rerender();
    act(() => {
      result.current.wait();
    });

    expect(result.current.wait).toBeTruthy();
  });

  it('Should Call onConfirm', async () => {
    const { result, rerender } = renderHook(() => useConfirmationModal());
    rerender();
    await waitFor(() => { result.current.props.onConfirm(); });
    expect(result.current.props).toBeTruthy();
  });

  it('Should Call onCancel', async () => {
    const { result, rerender } = renderHook(() => useConfirmationModal());
    rerender();
    act(() => {
      result.current.props.onCancel();
    });
    expect(result.current.props).toBeTruthy();
  });
  it('should return open value is false if wait promise is not called', async () => {
    const props = { onCancel: jest.fn(), onConfirm: jest.fn() };
    const wait = jest.fn();
    const { result } = renderHook(() => useConfirmationModal(wait, props));
    expect(result.current.props.open).toBe(false);
  });

  it('should return open value is true if wait promise is called', async () => {
    const props = { onCancel: jest.fn(), onConfirm: jest.fn() };
    const wait = jest.fn();
    const { result } = renderHook(() => useConfirmationModal(wait, props));
    act(() => {
      result.current.wait();
    });
    expect(result.current.props.open).toBe(true);
  });
});
