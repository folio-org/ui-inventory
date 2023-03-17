import { renderHook, act } from '@testing-library/react-hooks';
import useInstance from './useInstance';

describe('useInstance', () => {
  it('fetch instance data and return the instance and loading status', async () => {
    const mockMutator = {
      GET: jest.fn().mockResolvedValueOnce([{ id: 123, name: 'Test' }]),
    };
    const { result, waitForNextUpdate } = renderHook(() => useInstance(123, mockMutator));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.instance).toBe(undefined);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.instance).toEqual({ id: 123, name: 'Test' });
  });
  it('re-fetch instance data if id changes', async () => {
    const mockMutator = {
      GET: jest.fn().mockResolvedValueOnce([{ id: 123, name: 'Test' }])
      .mockResolvedValueOnce([{ id: 456, name: 'Test 2' }]),
    };
    const { result, rerender, waitForNextUpdate } = renderHook(({ id }) => useInstance(id, mockMutator), {
      initialProps: { id: 123 },
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.instance).toBe(undefined);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.instance).toEqual({ id: 123, name: 'Test' });
    act(() => {
      rerender({ id: 456 });
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.instance).toEqual({ id: 123, name: 'Test' });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.instance).toEqual({ id: 456, name: 'Test 2' });
  });
});
