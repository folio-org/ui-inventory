import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import '../../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import HoldingContainer from './HoldingContainer';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import { DataContext } from '../../../contexts';
import DnDContext from '../../DnDContext';

jest.mock('../../../hooks/useHoldingItemsQuery', () => jest.fn().mockReturnValue({ totalRecords: 10, isFetching: false }));
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useLocationsQuery: () => ({
    data: [
      {
        id: 'inactiveLocation',
        name: 'Location 1',
        isActive: false,
      },
    ],
  })
}));
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn().mockReturnValue('HoldingAccordion'),
}));

const dataContextValue = {
  locationsById: { inactiveLocation: { id: 'inactiveLocation', name: 'Location 1', isActive: false } },
};
const dndContextValue = {
  instances: [{ id: 'instance-id' }],
  selectedItemsMap: {},
  allHoldings: [],
  onSelect: jest.fn(),
};

const renderHoldingContainer = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <DataContext.Provider value={dataContextValue}>
      <DnDContext.Provider value={dndContextValue}>
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
          showViewHoldingsButton
          showAddItemButton
          pathToAccordionsState={['holdings']}
          {...props}
        />
      </DnDContext.Provider>
    </DataContext.Provider>
  </MemoryRouter>,
  translationsProperties,
);
describe('HoldingContainer', () => {
  it('should render HoldingContainer component', () => {
    renderHoldingContainer({ snapshot: { isDragging: false }, draggingHoldingsCount: 1, isDraggable: false });
    expect(screen.getByRole('button', { name: 'Holdings: Inactive >' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View holdings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
  it('should render selectHolding, moveButton toBeInTheDocument', () => {
    renderHoldingContainer({ snapshot: { isDragging: false }, draggingHoldingsCount: 1, isDraggable: true });
    expect(screen.getByText('Select holdings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to' })).toBeInTheDocument();
  });
  it('should render HoldingAccordion component', () => {
    renderHoldingContainer({ snapshot: { isDragging: true }, isDraggable: true });
    expect(screen.getByText('HoldingAccordion')).toBeInTheDocument();
  });
  it('should trigger buttons', () => {
    const { container } = renderHoldingContainer({ snapshot: { isDragging: true }, isDraggable: false });
    userEvent.click(container.querySelector('#clickable-view-holdings-123'));
    userEvent.click(container.querySelector('#clickable-new-item-123'));
    userEvent.click(screen.getByRole('button', { name: 'Add item' }));
    const primaryButton = screen.getByRole('button', { name: 'Add item' });
    expect(primaryButton).toHaveClass('button primary paneHeaderNewButton');
    expect(primaryButton).toBeEnabled();
  });
});
