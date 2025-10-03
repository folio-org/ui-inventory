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
      <div data-testid="register-function">{typeof context.registerOrderManagement}</div>
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
    expect(screen.getByTestId('register-function')).toHaveTextContent('function');
  });

  it('should allow registering order management functions', () => {
    const TestComponentWithRegistration = () => {
      const { registerOrderManagement, hasPendingChanges } = useContext(OrderManagementContext);
      const [registered, setRegistered] = useState(false);

      useEffect(() => {
        if (!registered) {
          act(() => {
            registerOrderManagement({
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
          registerOrderManagement({});
          registerOrderManagement(null);
          registerOrderManagement(undefined);
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
});
