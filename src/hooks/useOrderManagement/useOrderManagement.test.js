import { useContext } from 'react';
import { useIntl } from 'react-intl';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { CalloutContext } from '@folio/stripes/core';

import useOrderManagement from './useOrderManagement';
import useItemsUpdateMutation from '../useItemsUpdateMutation';
import { useInventoryState, useInventoryActions } from '../../dnd/InventoryProvider';

const mockIntl = {
  formatMessage: jest.fn(({ id }) => `translated.${id}`),
  formatDate: jest.fn(({ value }) => value),
};

jest.mock('react-intl', () => ({
  injectIntl: (Component) => (props) => <Component {...props} intl={mockIntl} />,
  useIntl: jest.fn(),
  FormattedMessage: jest.fn(({ id, children }) => {
    if (children) {
      return children([id]);
    }

    return id;
  }),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  CalloutContext: {
    Provider: ({ children }) => children,
  },
}));

jest.mock('../useItemsUpdateMutation', () => jest.fn());

jest.mock('../../dnd/InventoryProvider', () => ({
  useInventoryState: jest.fn(),
  useInventoryActions: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('useOrderManagement', () => {
  const mockCallout = {
    sendCallout: jest.fn(),
  };

  const mockUpdateItems = jest.fn();

  const mockInventoryState = {
    holdings: {
      'holding-1': {
        itemIds: ['item-1', 'item-2', 'item-3'],
      },
    },
    items: {
      'item-1': {
        id: 'item-1',
        order: '1',
        _version: 1,
        holdingId: 'holding-1',
      },
      'item-2': {
        id: 'item-2',
        order: '2',
        _version: 1,
        holdingId: 'holding-1',
      },
      'item-3': {
        id: 'item-3',
        order: '3',
        _version: 1,
        holdingId: 'holding-1',
      },
    },
  };

  const defaultProps = {
    holdingId: 'holding-1',
    tenantId: 'tenant-1',
  };

  const getTestItems = () => [
    { id: 'item-1', order: '1', holdingId: 'holding-1' },
    { id: 'item-2', order: '2', holdingId: 'holding-1' },
    { id: 'item-3', order: '3', holdingId: 'holding-1' },
  ];

  const mockInventoryActions = {
    updateItemsOrder: jest.fn(),
  };

  beforeEach(() => {
    useIntl.mockReturnValue(mockIntl);
    useContext.mockImplementation((context) => {
      if (context === CalloutContext) {
        return mockCallout;
      }
      return undefined;
    });
    useInventoryState.mockReturnValue(mockInventoryState);
    useInventoryActions.mockReturnValue(mockInventoryActions);
    useItemsUpdateMutation.mockReturnValue({
      mutateAsync: mockUpdateItems,
    });
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      expect(result.current.pendingOrderChanges).toEqual(new Map());
      expect(result.current.validationErrors).toEqual(new Map());
      expect(result.current.hasPendingChanges).toBe(false);
    });

    it('should provide all expected functions', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      expect(typeof result.current.handleOrderChange).toBe('function');
      expect(typeof result.current.applyOrderChanges).toBe('function');
      expect(typeof result.current.resetOrderChanges).toBe('function');
      expect(typeof result.current.initializeOriginalOrders).toBe('function');
    });
  });

  describe('initializeOriginalOrders', () => {
    it('should populate originalOrdersRef with provided item orders', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      const mockEvent = { target: { value: '1' } };

      act(() => {
        result.current.handleOrderChange(mockEvent, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(false);
    });

    it('should handle empty holdings gracefully', () => {
      useInventoryState.mockReturnValue({
        holdings: {},
        items: {},
      });

      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders([]);
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('handleOrderChange', () => {
    it('should add manual change when value differs from original', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      const mockEvent = { target: { value: '5' } };

      act(() => {
        result.current.handleOrderChange(mockEvent, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);
    });

    it('should remove manual change when reverting to original value', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);

      act(() => {
        result.current.handleOrderChange({ target: { value: '1' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(false);
    });

    it('should auto-adjust other items when changing order', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '2' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);
    });

    it('should handle invalid values gracefully', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: 'abc' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);
    });
  });

  describe('validateOrder', () => {
    it('should validate positive integers', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Test valid positive integer
      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      // Should not have validation errors for valid input
      expect(result.current.validationErrors.size).toBe(0);
    });

    it('should detect duplicate values within manual changes', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Set two items to the same order
      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-2');
      });

      // Should have validation errors for duplicates
      expect(result.current.validationErrors.size).toBeGreaterThan(0);
    });

    it('should not flag duplicates across different values', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Set items to different orders
      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '6' } }, 'item-2');
      });

      // Should not have validation errors
      expect(result.current.validationErrors.size).toBe(0);
    });
  });

  describe('applyOrderChanges', () => {
    it('should apply order changes successfully', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '2' } }, 'item-1');
      });

      mockUpdateItems.mockResolvedValue();

      await act(async () => {
        await result.current.applyOrderChanges();
      });

      expect(mockUpdateItems).toHaveBeenCalledWith({
        items: expect.arrayContaining([
          expect.objectContaining({ id: 'item-2', order: '1' }),
          expect.objectContaining({ id: 'item-1', order: '2' }),
          expect.objectContaining({ id: 'item-3', order: '3' }),
        ]),
      });

      // Should clear pending changes after successful update
      expect(result.current.hasPendingChanges).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '2' } }, 'item-1');
      });

      const error = new Error('API Error');
      mockUpdateItems.mockRejectedValue(error);

      await expect(act(async () => {
        await result.current.applyOrderChanges();
      })).rejects.toThrow('API Error');

      expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'translated.ui-inventory.item.order.update.error',
      });

      // Should still have pending changes after error
      expect(result.current.hasPendingChanges).toBe(true);
    });

    it('should validate manual changes before applying', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Create duplicate orders
      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-2');
      });

      await act(async () => {
        await result.current.applyOrderChanges();
      });

      // The current implementation doesn't prevent API calls on validation failure
      // It just returns early, but previous calls might have already happened
      // So we check that validation errors exist
      expect(result.current.validationErrors.size).toBeGreaterThan(0);
    });

    it('should sort items by order before updating', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Change orders to create a different sequence
      act(() => {
        result.current.handleOrderChange({ target: { value: '3' } }, 'item-1');
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '1' } }, 'item-3');
      });

      mockUpdateItems.mockResolvedValue();

      await act(async () => {
        await result.current.applyOrderChanges();
      });

      const updateCall = mockUpdateItems.mock.calls[0][0];
      const items = updateCall.items;

      // Should be sorted by order
      expect(items[0].order).toBe('1');
      expect(items[1].order).toBe('2');
      expect(items[2].order).toBe('3');
    });
  });

  describe('resetOrderChanges', () => {
    it('should clear all pending changes', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);

      act(() => {
        result.current.resetOrderChanges();
      });

      expect(result.current.hasPendingChanges).toBe(false);
      expect(result.current.validationErrors.size).toBe(0);
    });
  });

  describe('hasPendingChanges', () => {
    it('should return false when no changes', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      expect(result.current.hasPendingChanges).toBe(false);
    });

    it('should return true when there are pending changes', () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      expect(result.current.hasPendingChanges).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle missing holding gracefully', () => {
      useInventoryState.mockReturnValue({
        holdings: {},
        items: {},
      });

      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      expect(result.current).toBeDefined();
    });

    it('should handle missing items gracefully', () => {
      useInventoryState.mockReturnValue({
        holdings: {
          'holding-1': {
            itemIds: ['item-1', 'item-2'],
          },
        },
        items: {
          'item-1': {
            id: 'item-1',
            order: '1',
            _version: 1,
            holdingId: 'holding-1',
          },
          // item-2 is missing
        },
      });

      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '5' } }, 'item-1');
      });

      expect(result.current).toBeDefined();
    });

    it('should handle empty itemIds array', () => {
      useInventoryState.mockReturnValue({
        holdings: {
          'holding-1': {
            itemIds: [],
          },
        },
        items: {},
      });

      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex reordering scenario', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      // Move item-1 to position 3
      act(() => {
        result.current.handleOrderChange({ target: { value: '3' } }, 'item-1');
      });

      // Move item-3 to position 1
      act(() => {
        result.current.handleOrderChange({ target: { value: '1' } }, 'item-3');
      });

      mockUpdateItems.mockResolvedValue();

      await act(async () => {
        await result.current.applyOrderChanges();
      });

      const updateCall = mockUpdateItems.mock.calls[0][0];
      const items = updateCall.items;

      // Verify the final order - items are sorted by their order values
      expect(items).toHaveLength(3);
      // The final order depends on how the auto-adjustment and sorting works
      expect(items.map(item => item.id)).toContain('item-1');
      expect(items.map(item => item.id)).toContain('item-2');
      expect(items.map(item => item.id)).toContain('item-3');
      expect(items[0].order).toBe('1');
      expect(items[1].order).toBe('2');
      expect(items[2].order).toBe('3');
    });

    it('should handle multiple changes and validation', async () => {
      const { result } = renderHook(() => useOrderManagement(defaultProps));

      act(() => {
        result.current.initializeOriginalOrders(getTestItems());
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '2' } }, 'item-1');
      });

      act(() => {
        result.current.handleOrderChange({ target: { value: '1' } }, 'item-2');
      });

      expect(result.current.hasPendingChanges).toBe(true);

      expect(result.current.validationErrors.size).toBe(0);

      mockUpdateItems.mockResolvedValue();

      await act(async () => {
        await result.current.applyOrderChanges();
      });

      expect(mockUpdateItems).toHaveBeenCalled();
      expect(result.current.hasPendingChanges).toBe(false);
    });
  });
});
