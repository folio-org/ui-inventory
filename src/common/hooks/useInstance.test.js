import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import useInstance from './useInstance';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';
import useInstanceQuery from './useInstanceQuery';

jest.mock('./useSearchInstanceByIdQuery', () => jest.fn());
jest.mock('./useInstanceQuery', () => jest.fn());

describe('useInstance', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useSearchInstanceByIdQuery.mockReturnValue({
      instance: {
        shared: false,
        tenantId: 'tenantId',
      },
      isLoading: false,
    });
  });

  it('fetch instance data and return the instance and loading status', async () => {
    useInstanceQuery.mockReturnValueOnce({
      instance: {
        id: 123,
        name: 'Test',
      },
      isLoading: false,
    });
    const { result } = renderHook(() => useInstance(123));

    const expectedInstance = { id: 123, name: 'Test', shared: false, tenantId: 'tenantId' };

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.instance).toEqual(expectedInstance);
    });
  });
  it('re-fetch instance data if id changes', async () => {
    useInstanceQuery.mockReturnValueOnce({
      instance: {
        id: 123,
        name: 'Test',
      },
      isLoading: false,
    }).mockReturnValueOnce({
      instance: {
        id: 456,
        name: 'Test 2',
      },
      isLoading: false,
    });
    const { result, rerender } = renderHook(({ id }) => useInstance(id), {
      initialProps: { id: 123 },
    });

    const expectedInstance = { id: 123, name: 'Test', shared: false, tenantId: 'tenantId' };

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.instance).toEqual(expectedInstance);
    });

    rerender({ id: 456 });

    const expectedInstanceAfterRerender = { id: 456, name: 'Test 2', shared: false, tenantId: 'tenantId' };

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.instance).toEqual(expectedInstanceAfterRerender);
    });
  });
});
