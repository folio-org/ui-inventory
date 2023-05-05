import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useMoveItemsMutation } from '../../common';

import { useItems } from './useItems';

import '../../../test/jest/__mock__';

jest.mock('@folio/stripes/core', () => ({
  CalloutContext: {
    Consumer: ({ children }) => children({ sendCallout: jest.fn() }),
  },
}));

jest.mock('../../RemoteStorageService', () => ({
  Check: {
    useByHoldings: jest.fn().mockReturnValue(jest.fn()),
  },
  Warning: {
    ForItems: jest.fn(({ count }) => `Warning: ${count} items`),
  },
}));

jest.mock('../../RemoteStorageService', () => ({
  Check: {
    useByHoldings: jest.fn(() => jest.fn()),
  },
  Warning: {
    ForItems: jest.fn(({ count }) => `Warning: ${count} items`),
  },
}));

jest.mock('../../common', () => ({
  useMoveItemsMutation: jest.fn(),
}));

describe('useItems', () => {
  let callout;
  let checkFromRemoteToNonRemote;
  let mutate;
  let moveItems;
  beforeEach(() => {
    callout = { sendCallout: jest.fn() };
    checkFromRemoteToNonRemote = jest.fn().mockReturnValue(false);
    mutate = jest.fn();
    useMoveItemsMutation.mockReturnValue({ mutate });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useItems());
    expect(result.current.isMoving).toBeFalsy();
    expect(result.current.moveItems).toBeInstanceOf(Function);
  });
  describe('moveItems', () => {
    const fromHoldingsId = 'fromHoldingsId';
    const toHoldingsId = 'toHoldingsId';
    const itemIds = ['itemId1', 'itemId2'];
    beforeEach(() => {
      mutate.mockReturnValue(Promise.resolve({}));
    });
    it('moveItems calls useMoveItemsMutation with the correct arguments', () => {
      const mockMutate = jest.fn();
      useMoveItemsMutation.mockReturnValue({
        mutate: mockMutate,
      });
      const { result } = renderHook(() => useItems());
      act(() => {
        result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);
      });
      expect(useMoveItemsMutation).toHaveBeenCalledWith({
        onMutate: expect.any(Function),
        onSettled: expect.any(Function),
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      });
      expect(mockMutate).toHaveBeenCalledWith(
        {
          toHoldingsRecordId: toHoldingsId,
          itemIds,
        },
        { onSuccess: expect.any(Function) }
      );
    });
    it('should set isMoving to true when onMutate is called', () => {
      const { result } = renderHook(() => useItems());
      result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);
      const { onMutate } = useMoveItemsMutation.mock.calls[0][0];
      onMutate();
      act(() => {
        expect(result.current.isMoving).toBeTruthy();
      });
    });
    it('should set isMoving to false when onSettled is called', () => {
      const { result } = renderHook(() => useItems());
      result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);
      const { onSettled } = useMoveItemsMutation.mock.calls[0][0];
      onSettled();
      act(() => {
        expect(result.current.isMoving).toBeFalsy();
      });
    });
    // it('sends an error callout when onError is called', async () => {
    //     const error = { message: 'An error occurred' };
    //     useMoveItemsMutation.mockReturnValueOnce({
    //         mutate: jest.fn(() => Promise.reject(error)),
    //     });
    //     const { result, waitFor } = renderHook(() => useItems());
    //     result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);

    //     const { onError } = useMoveItemsMutation.mock.calls[0][0];
    //     onError(error);

    //     await waitFor(() => expect(result.current.isMoving).toBe(false));
    //     expect(result.current.error).toBe(error.message);
    //     expect(result.current.success).toBe(null);
    //     expect(callout.sendCallout).toHaveBeenCalledWith({
    //         type: 'error',
    //         message: error.message,
    //     });
    // });

    // it('sends an error callout when onError is called', () => {
    //   const { result } = renderHook(() => useItems());
    //   result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);
    //   const { onError } = useMoveItemsMutation.mock.calls[0][0];
    //   onError({ message: 'An error occurred' });
    //   expect(result.current.isMoving).toBe(false);
    //   expect(result.current.error).toBe(errorMessage);
    //   expect(result.current.success).toBe(null);
    //   expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // });
    // it('should set error and send error callout when onError is called', async () => {
    //     const { result } = renderHook(() => useItems());
    //     result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);

    //     const errorMessage = 'An error occurred';
    //     const error = new Error(errorMessage);

    //     const { onError } = useMoveItemsMutation.mock.calls[0][0];
    //     onError(error);

    //     await act(async () => {
    //         expect(result.current.isMoving).toBeFalsy();
    //         expect(result.current.error).toBe(error);
    //         expect(result.current.success).toBeNull();
    //         expect(callout.sendCallout).toHaveBeenCalledTimes(1);
    //         expect(callout.sendCallout).toHaveBeenCalledWith(
    //         expect.objectContaining({ type: 'error', message: errorMessage })
    //         );
    //     });
    // });
    // it('should not do anything when onSuccess is called', () => {
    //   const { result } = renderHook(() => useItems());
    //   result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds);
    //   const { onSuccess } = useMoveItemsMutation.mock.calls[0][0];

    //   onSuccess();

    //   expect(result.current).toEqual({
    //     isMoving: false,
    //   });
    // });

    // it('sends error callout on error', async () => {
    //   const onError = jest.fn(() => {
    //     throw new Error('Move items failed');
    //   });
    //   useMoveItemsMutation.mockReturnValueOnce({
    //     mutate: jest.fn(() => Promise.reject(new Error('Move items failed'))),
    //   });
    //   const { result } = renderHook(() => useItems());
    //   await expect(result.current.moveItems(fromHoldingsId, toHoldingsId, itemIds)).rejects.toThrow(
    //     'Move items failed'
    //   );
    //   expect(useMoveItemsMutation).toHaveBeenCalledTimes(1);
    // });
  });
});
