import {
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  render,
  screen,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import OrderManagementProvider from './OrderManagementProvider';
import { OrderManagementContext } from '../contexts';

// Test component to access context
const TestComponent = () => {
  const context = useContext(OrderManagementContext);

  return (
    <div>
      <div data-testid="has-pending-changes">{context.hasPendingChanges ? 'true' : 'false'}</div>
      <div data-testid="has-any-pending-changes">{context.hasAnyPendingChanges ? 'true' : 'false'}</div>
      <div data-testid="register-function">{typeof context.registerOrderManagement}</div>
      <div data-testid="apply-all-function">{typeof context.applyAllOrderChanges}</div>
      <div data-testid="reset-all-function">{typeof context.resetAllOrderChanges}</div>
    </div>
  );
};

describe('OrderManagementProvider', () => {
  it('should render children and provide context', () => {
    render(
      <OrderManagementProvider>
        <TestComponent />
      </OrderManagementProvider>
    );

    expect(screen.getByTestId('has-pending-changes')).toHaveTextContent('false');
    expect(screen.getByTestId('has-any-pending-changes')).toHaveTextContent('false');
    expect(screen.getByTestId('register-function')).toHaveTextContent('function');
    expect(screen.getByTestId('apply-all-function')).toHaveTextContent('function');
    expect(screen.getByTestId('reset-all-function')).toHaveTextContent('function');
  });

  it('should allow registering order management functions', () => {
    const TestComponentWithRegistration = () => {
      const { registerOrderManagement, hasPendingChanges } = useContext(OrderManagementContext);
      const [registered, setRegistered] = useState(false);

      useEffect(() => {
        if (!registered) {
          act(() => {
            registerOrderManagement('holding-1', {
              applyOrderChanges: jest.fn(),
              resetOrderChanges: jest.fn(),
              hasPendingChanges: true,
            });
            setRegistered(true);
          });
        }
      }, [registerOrderManagement, registered]);

      return (
        <div data-testid="has-pending-changes">{hasPendingChanges ? 'true' : 'false'}</div>
      );
    };

    render(
      <OrderManagementProvider>
        <TestComponentWithRegistration />
      </OrderManagementProvider>
    );

    expect(screen.getByTestId('has-pending-changes')).toHaveTextContent('true');
  });

  it('should handle edge cases gracefully', () => {
    const TestComponentWithEdgeCases = () => {
      const { registerOrderManagement } = useContext(OrderManagementContext);

      useEffect(() => {
        act(() => {
          // Test various edge cases
          registerOrderManagement('holding-1', {});
          registerOrderManagement('holding-2', null);
          registerOrderManagement('holding-3', undefined);
        });
      }, [registerOrderManagement]);

      return <div>Edge Cases Test</div>;
    };

    expect(() => {
      render(
        <OrderManagementProvider>
          <TestComponentWithEdgeCases />
        </OrderManagementProvider>
      );
    }).not.toThrow();
  });

  it('should apply order changes for all holdings with pending changes', async () => {
    const mockApplyOrderChanges1 = jest.fn().mockResolvedValue(undefined);
    const mockApplyOrderChanges2 = jest.fn().mockResolvedValue(undefined);
    const mockApplyOrderChanges3 = jest.fn().mockResolvedValue(undefined);

    const TestComponentWithApplyAll = () => {
      const { registerOrderManagement, applyAllOrderChanges, hasAnyPendingChanges } = useContext(OrderManagementContext);
      const [registered, setRegistered] = useState(false);

      useEffect(() => {
        if (!registered) {
          act(() => {
            registerOrderManagement('holding-1', {
              applyOrderChanges: mockApplyOrderChanges1,
              resetOrderChanges: jest.fn(),
              hasPendingChanges: true,
            });
            registerOrderManagement('holding-2', {
              applyOrderChanges: mockApplyOrderChanges2,
              resetOrderChanges: jest.fn(),
              hasPendingChanges: false,
            });
            registerOrderManagement('holding-3', {
              applyOrderChanges: mockApplyOrderChanges3,
              resetOrderChanges: jest.fn(),
              hasPendingChanges: true,
            });
            setRegistered(true);
          });
        }
      }, [registerOrderManagement, registered]);

      return (
        <div>
          <div data-testid="has-any-pending">{hasAnyPendingChanges ? 'true' : 'false'}</div>
          <button
            type="button"
            data-testid="apply-all-button"
            onClick={() => applyAllOrderChanges()}
          >
            Apply All
          </button>
        </div>
      );
    };

    render(
      <OrderManagementProvider>
        <TestComponentWithApplyAll />
      </OrderManagementProvider>
    );

    expect(screen.getByTestId('has-any-pending')).toHaveTextContent('true');

    await act(async () => {
      screen.getByTestId('apply-all-button').click();
    });

    expect(mockApplyOrderChanges1).toHaveBeenCalled();
    expect(mockApplyOrderChanges2).toHaveBeenCalled();
    expect(mockApplyOrderChanges3).toHaveBeenCalled();
  });

  it('should reset order changes for all holdings', () => {
    const mockResetOrderChanges1 = jest.fn();
    const mockResetOrderChanges2 = jest.fn();
    const mockResetOrderChanges3 = jest.fn();

    const TestComponentWithResetAll = () => {
      const { registerOrderManagement, resetAllOrderChanges } = useContext(OrderManagementContext);
      const [registered, setRegistered] = useState(false);

      useEffect(() => {
        if (!registered) {
          act(() => {
            registerOrderManagement('holding-1', {
              applyOrderChanges: jest.fn(),
              resetOrderChanges: mockResetOrderChanges1,
              hasPendingChanges: true,
            });
            registerOrderManagement('holding-2', {
              applyOrderChanges: jest.fn(),
              resetOrderChanges: mockResetOrderChanges2,
              hasPendingChanges: false,
            });
            registerOrderManagement('holding-3', {
              applyOrderChanges: jest.fn(),
              resetOrderChanges: mockResetOrderChanges3,
              hasPendingChanges: true,
            });
            setRegistered(true);
          });
        }
      }, [registerOrderManagement, registered]);

      return (
        <button
          type="button"
          data-testid="reset-all-button"
          onClick={() => resetAllOrderChanges()}
        >
          Reset All
        </button>
      );
    };

    render(
      <OrderManagementProvider>
        <TestComponentWithResetAll />
      </OrderManagementProvider>
    );

    act(() => {
      screen.getByTestId('reset-all-button').click();
    });

    expect(mockResetOrderChanges1).toHaveBeenCalled();
    expect(mockResetOrderChanges2).toHaveBeenCalled();
    expect(mockResetOrderChanges3).toHaveBeenCalled();
  });
});
