import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import '../../../../test/jest/__mock__';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import HoldingContainer from './HoldingContainer';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn().mockReturnValue({ locationsById: {}, selectedItemsMap: {} })
}));
jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});
jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn().mockReturnValue({ totalRecords: 10, isFetching: false }));
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn().mockReturnValue('HoldingAccordion'),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderHoldingContainer = (props = {}) => render(
  <IntlProvider locale="en">
    <HoldingContainer
      instance={{ id: 'test' }}
      holding={{ id: '123' }}
      holdings={[{ id: '2' }]}
      history={jest.fn()}
      location={{ search: 'ert' }}
      isHoldingDragSelected={jest.fn()}
      droppable={false}
      provided={{ draggableProps: { style: true } }}
      onViewHolding={jest.fn()}
      onAddItem={jest.fn()}
      {...props}
    />
  </IntlProvider>,
  { wrapper },
);
describe('HoldingContainer', () => {
  it('should render HoldingContainer component', () => {
    renderHoldingContainer({ snapshot: { isDragging: false }, draggingHoldingsCount: 1, isDraggable: false });
    expect(screen.getByText('ui-inventory.holdingsHeader')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.viewHoldings')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.addItem')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
  it('should render selectHolding, moveButton toBeInTheDocument', () => {
    renderHoldingContainer({ snapshot: { isDragging: false }, draggingHoldingsCount: 1, isDraggable: true });
    expect(screen.getByText('ui-inventory.moveItems.selectHolding')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.moveItems.moveButton')).toBeInTheDocument();
  });
  it('should render HoldingAccordion component', () => {
    renderHoldingContainer({ snapshot: { isDragging: true }, isDraggable: true });
    expect(screen.getByText('HoldingAccordion')).toBeInTheDocument();
  });
  it('should trigger buttons', () => {
    const { container } = renderHoldingContainer({ snapshot: { isDragging: true }, isDraggable: false });
    userEvent.click(container.querySelector('#clickable-view-holdings-123'));
    userEvent.click(container.querySelector('#clickable-new-item-123'));
    userEvent.click(screen.getByText('ui-inventory.addItem'));
    const primaryButton = screen.getByRole('button', { name: /ui-inventory.addItem/i });
    expect(primaryButton).toHaveClass('button primary paneHeaderNewButton');
    expect(primaryButton).toBeEnabled();
  });
});
