import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import useMoveCommands from '../useMoveCommands';
import { useInventoryState, useInventoryActions } from '../../InventoryProvider';
import { useSelection } from '../../SelectionProvider';
import { useConfirmBridge } from '../../ConfirmationBridge';
import useInventoryAPI from '../useInventoryAPI';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ id }) => `translated.${id}`),
  })),
}));

jest.mock('../../../hooks/useReferenceData', () => jest.fn(() => ({
  locationsById: {},
})));

jest.mock('../../../RemoteStorageService', () => ({
  Check: {
    useByHoldings: () => jest.fn(() => false),
  },
  Confirmation: {
    Message: () => null,
  },
}));

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  callNumberLabel: jest.fn(() => ''),
}));

jest.mock('../../InventoryProvider', () => ({
  useInventoryState: jest.fn(),
  useInventoryActions: jest.fn(),
}));

jest.mock('../../SelectionProvider', () => ({
  useSelection: jest.fn(),
}));

jest.mock('../../ConfirmationBridge', () => ({
  useConfirmBridge: jest.fn(),
}));

jest.mock('../useInventoryAPI', () => jest.fn());

const getDefaultState = () => ({
  instances: {
    instA: { id: 'instA', title: 'Instance A' },
    instB: { id: 'instB', title: 'Instance B' },
  },
  holdings: {
    h1: { id: 'h1', permanentLocationId: 'loc1', itemIds: ['i1', 'i2'] },
    h2: { id: 'h2', permanentLocationId: 'loc2', itemIds: [] },
  },
  items: {
    i1: { id: 'i1', holdingId: 'h1' },
    i2: { id: 'i2', holdingId: 'h1' },
  },
});

describe('useMoveCommands', () => {
  const setIsMoveHoldingsModalOpen = jest.fn();
  const setMoveModalMessage = jest.fn();
  const setOnConfirm = jest.fn();
  const setOnCancel = jest.fn();

  const actions = {
    moveItems: jest.fn(),
    moveHolding: jest.fn(),
  };

  const selection = {
    getSelectedItemsFromHolding: jest.fn(),
    getSelectedHoldingsFromInstance: jest.fn(),
    toggleAllItems: jest.fn(),
    clear: jest.fn(),
  };

  const api = {
    moveItems: jest.fn(),
    moveHoldings: jest.fn(),
    checkPOLinkage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useInventoryState.mockReturnValue(getDefaultState());
    useInventoryActions.mockReturnValue(actions);
    useSelection.mockReturnValue(selection);
    useConfirmBridge.mockReturnValue({
      setIsMoveHoldingsModalOpen,
      setMoveModalMessage,
      setOnConfirm,
      setOnCancel,
    });
    useInventoryAPI.mockReturnValue(api);

    selection.getSelectedItemsFromHolding.mockReturnValue(new Set(['i1', 'i2']));
    selection.getSelectedHoldingsFromInstance.mockReturnValue(new Set(['h1']));

    api.checkPOLinkage.mockResolvedValue({ hasLinkedPOLs: false, poLineHoldingIds: [] });
  });

  describe('moveSelectedItemsToHolding', () => {
    it('opens confirmation modal in dual-instance mode and wires confirm/cancel', async () => {
      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedItemsToHolding({
          fromHoldingId: 'h1',
          toHoldingId: 'h2',
          onReject: jest.fn(),
        });
      });

      expect(setMoveModalMessage).toHaveBeenCalled();
      expect(setOnConfirm).toHaveBeenCalledWith(expect.any(Function));
      expect(setOnCancel).toHaveBeenCalledWith(expect.any(Function));
      expect(setIsMoveHoldingsModalOpen).toHaveBeenCalledWith(true);

      // Simulate user confirming
      const startConfirm = setOnConfirm.mock.calls[0][0];
      const runConfirm = startConfirm();
      await act(async () => {
        await runConfirm();
      });

      expect(api.moveItems).toHaveBeenCalledWith(expect.objectContaining({
        fromHoldingId: 'h1',
        toHoldingId: 'h2',
        itemIds: ['i1', 'i2'],
        withRemoteCheck: false,
        onSuccess: expect.any(Function),
      }));

      // Fire onSuccess and verify state updates
      const onSuccess = api.moveItems.mock.calls[0][0].onSuccess;
      act(() => {
        onSuccess();
      });

      expect(actions.moveItems).toHaveBeenCalledWith({
        itemIds: ['i1', 'i2'],
        toHoldingId: 'h2',
      });
      expect(selection.clear).toHaveBeenCalled();
    });

    it('moves directly in single-instance mode without modal', async () => {
      useInventoryState.mockReturnValue({
        ...getDefaultState(),
        instances: { instA: { id: 'instA' } },
      });

      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedItemsToHolding({
          fromHoldingId: 'h1',
          toHoldingId: 'h2',
        });
      });

      expect(api.moveItems).toHaveBeenCalledWith(expect.objectContaining({
        fromHoldingId: 'h1',
        toHoldingId: 'h2',
        itemIds: ['i1', 'i2'],
        withRemoteCheck: true,
      }));
      expect(actions.moveItems).toHaveBeenCalledWith({ itemIds: ['i1', 'i2'], toHoldingId: 'h2' });
      expect(selection.toggleAllItems).toHaveBeenCalledWith('h1', false);
      expect(setIsMoveHoldingsModalOpen).not.toHaveBeenCalled();
    });

    it('uses provided itemIds when passed explicitly (single-instance path)', async () => {
      useInventoryState.mockReturnValue({
        ...getDefaultState(),
        instances: { instA: { id: 'instA' } },
      });

      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedItemsToHolding({
          fromHoldingId: 'h1',
          toHoldingId: 'h2',
          itemIds: ['i2'],
        });
      });

      expect(api.moveItems).toHaveBeenCalledWith(expect.objectContaining({
        itemIds: ['i2'],
        withRemoteCheck: true,
      }));
    });

    it('returns early if no items selected', async () => {
      selection.getSelectedItemsFromHolding.mockReturnValue(new Set());

      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedItemsToHolding({
          fromHoldingId: 'h1',
          toHoldingId: 'h2',
        });
      });

      expect(api.moveItems).not.toHaveBeenCalled();
      expect(setIsMoveHoldingsModalOpen).not.toHaveBeenCalled();
    });
  });

  describe('moveSelectedHoldingsToInstance', () => {
    it('opens confirmation modal in dual-instance mode and wires confirm', async () => {
      api.checkPOLinkage.mockResolvedValue({ hasLinkedPOLs: true, poLineHoldingIds: ['h2'] });

      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedHoldingsToInstance({
          activeHoldingId: 'h1',
          fromInstanceId: 'instA',
          toInstanceId: 'instB',
          toInstanceHrid: 'B-hrid',
        });
      });

      expect(setMoveModalMessage).toHaveBeenCalled();
      expect(setOnConfirm).toHaveBeenCalledWith(expect.any(Function));
      expect(setIsMoveHoldingsModalOpen).toHaveBeenCalledWith(true);

      const startConfirm = setOnConfirm.mock.calls[0][0];
      const runConfirm = startConfirm();

      await act(async () => {
        await runConfirm();
      });

      expect(api.moveHoldings).toHaveBeenCalledWith(expect.objectContaining({
        toInstanceId: 'instB',
        toInstanceHrid: 'B-hrid',
        holdings: expect.arrayContaining(['h1', 'h2']),
        onSuccess: expect.any(Function),
      }));

      const onSuccess = api.moveHoldings.mock.calls[0][0].onSuccess;
      act(() => {
        onSuccess();
      });

      const calledHoldingIds = actions.moveHolding.mock.calls.map(call => call[0].holdingId);
      expect(calledHoldingIds).toEqual(expect.arrayContaining(['h1', 'h2']));
      expect(selection.clear).toHaveBeenCalled();
    });

    it('adds onCancel when onReject provided', async () => {
      const onReject = jest.fn();
      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedHoldingsToInstance({
          activeHoldingId: 'h1',
          fromInstanceId: 'instA',
          toInstanceId: 'instB',
          toInstanceHrid: 'B-hrid',
          onReject,
        });
      });

      expect(setOnCancel).toHaveBeenCalledWith(expect.any(Function));
    });

    it('includes activeHoldingId when selection empty (no early return)', async () => {
      selection.getSelectedHoldingsFromInstance.mockReturnValue(new Set());

      const { result } = renderHook(() => useMoveCommands());

      await act(async () => {
        await result.current.moveSelectedHoldingsToInstance({
          activeHoldingId: 'hX',
          fromInstanceId: 'instA',
          toInstanceId: 'instB',
          toInstanceHrid: 'B-hrid',
        });
      });

      expect(api.checkPOLinkage).toHaveBeenCalledTimes(1);
      expect(setIsMoveHoldingsModalOpen).toHaveBeenCalledWith(true);
    });
  });
});
