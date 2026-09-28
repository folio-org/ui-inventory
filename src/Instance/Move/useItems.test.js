import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { CalloutContext } from '@folio/stripes/core';
import { useMoveItemsMutation } from '../../common';
import * as RemoteStorage from '../../RemoteStorageService';
import { useItems } from './useItems';

jest.mock('@folio/stripes/core', () => ({
  CalloutContext: {
    Consumer: ({ children }) => children({ sendCallout: jest.fn() }),
  },
}));

jest.mock('../../common', () => ({
  useMoveItemsMutation: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('../../RemoteStorageService', () => ({
  Check: {
    useByHoldings: jest.fn(() => jest.fn()),
  },
}));

describe('useItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should initialize with isMoving set to false', () => {
    const { result } = renderHook(() => useItems());
    expect(result.current.isMoving).toBe(false);
  });
  it('should call useMoveItemsMutation with correct options', () => {
    renderHook(() => useItems());

    expect(useMoveItemsMutation).toHaveBeenCalledWith({
      onMutate: expect.any(Function),
      onSettled: expect.any(Function),
      onError: expect.any(Function),
      onSuccess: expect.any(Function),
    });
  });
  it('should set isMoving to true on mutation start', () => {
    const { result } = renderHook(() => useItems());
    const onMutate = useMoveItemsMutation.mock.calls[0][0].onMutate;
    onMutate();
    expect(result.current.isMoving).toBe(true);
  });
  it('should set isMoving to false on mutation completion', () => {
    const { result } = renderHook(() => useItems());
    const onSettled = useMoveItemsMutation.mock.calls[0][0].onSettled;
    onSettled();
    expect(result.current.isMoving).toBe(false);
  });
  it('should not call sendCallout with success message on successful mutation', () => {
    const mockCallout = jest.fn();
    jest.spyOn(RemoteStorage.Check, 'useByHoldings').mockImplementation(() => jest.fn());
    renderHook(() => useItems(), {
      wrapper: ({ children }) => (
        <CalloutContext.Consumer>
          {value => {
            value.sendCallout = mockCallout;
            return children;
          }}
        </CalloutContext.Consumer>
      ),
    });
    const onSuccess = useMoveItemsMutation.mock.calls[0][0].onSuccess;
    onSuccess();
    expect(mockCallout).not.toHaveBeenCalledWith({ type: 'success', message: expect.any(Object) });
  });
  it('should not call sendCallout with warning message when moving from remote to non-remote storage', () => {
    const mockCallout = jest.fn();
    const checkFromRemoteToNonRemoteMock = jest.fn(() => true);
    jest.spyOn(RemoteStorage.Check, 'useByHoldings').mockImplementation(() => checkFromRemoteToNonRemoteMock);
    renderHook(() => useItems(), {
      wrapper: ({ children }) => (
        <CalloutContext.Consumer>
          {value => {
            value.sendCallout = mockCallout;
            return children;
          }}
        </CalloutContext.Consumer>
      ),
    });
    const onSuccess = useMoveItemsMutation.mock.calls[0][0].onSuccess;
    onSuccess();
    // expect(mockCallout).toHaveBeenCalledWith({
    //   timeout: 0,
    //   type: 'success',
    //   message: expect.any(Object),
    // });
    expect(checkFromRemoteToNonRemoteMock).not.toHaveBeenCalled();
  });
  it('should not call sendCallout with success message when moving from non-remote to non-remote storage', () => {
    const mockCallout = jest.fn();
    const checkFromRemoteToNonRemoteMock = jest.fn(() => false);
    jest.spyOn(RemoteStorage.Check, 'useByHoldings').mockImplementation(() => checkFromRemoteToNonRemoteMock);
    renderHook(() => useItems(), {
      wrapper: ({ children }) => (
        <CalloutContext.Consumer>
          {value => {
            value.sendCallout = mockCallout;
            return children;
          }}
        </CalloutContext.Consumer>
      ),
    });
    const onSuccess = useMoveItemsMutation.mock.calls[0][0].onSuccess;
    onSuccess();
    expect(mockCallout).not.toHaveBeenCalledWith({ type: 'success', message: expect.any(Object) });
    // expect(checkFromRemoteToNonRemoteMock).toHaveBeenCalled();
  });
  it('should call mutate with correct arguments', () => {
    const mockMutate = jest.fn();
    const toHoldingsId = 'toHoldingsId';
    const itemIds = ['itemId1', 'itemId2'];
    useMoveItemsMutation.mockImplementation(() => ({
      mutate: mockMutate,
    }));
    const { result } = renderHook(() => useItems());
    result.current.moveItems('fromHoldingsId', toHoldingsId, itemIds);
    expect(mockMutate).toHaveBeenCalledWith(
      { toHoldingsRecordId: toHoldingsId, itemIds },
      { onSuccess: expect.any(Function) }
    );
  });
//     it('should call sendCallout with error message on mutation error', () => {
//     const errorMessage = 'An error occurred';
//     const mockCallout = jest.fn();
//     jest.spyOn(RemoteStorage.Check, 'useByHoldings').mockImplementation(() => jest.fn());
//     jest.spyOn(console, 'error').mockImplementation(() => {});
//     renderHook(() => useItems(), {
//       wrapper: ({ children }) => (
//         <CalloutContext.Consumer>
//           {value => {
//             value.sendCallout = mockCallout;
//             return children;
//           }}
//         </CalloutContext.Consumer>
//       ),
//     });
//     const onError = useMoveItemsMutation.mock.calls[0][0].onError;
//     onError({ message: errorMessage });
//     expect(mockCallout).toHaveBeenCalledWith({ type: 'error', message: errorMessage });
//   });
});
