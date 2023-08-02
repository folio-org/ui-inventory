import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import Holding from './Holding';

jest.mock('../../ItemsList', () => ({
  ItemsListContainer: jest.fn().mockReturnValue('ItemsListContainer'),
  DropZone: jest.fn().mockReturnValue('Accordion')
}));

const holding = { id: 1, name: 'Test Holding' };
const onViewHolding = jest.fn();
const onAddItem = jest.fn();
const holdings = [{ id: 2, name: 'Test Holding 2' }];
const draggable = true;
const droppable = true;
const selectHoldingsForDrag = jest.fn();
const isHoldingDragSelected = jest.fn();
const isDraggable = true;
const isItemsDroppable = true;

const HoldingSetup = () => (
  <Router>
    <Holding
      holding={holding}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
      holdings={holdings}
      draggable={draggable}
      droppable={droppable}
      selectHoldingsForDrag={selectHoldingsForDrag}
      isHoldingDragSelected={isHoldingDragSelected}
      isDraggable={isDraggable}
      isItemsDroppable={isItemsDroppable}
    />
  </Router>
);

const renderHolding = () => renderWithIntl(
  <HoldingSetup />,
  translations
);

describe('Holding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    renderHolding();
  });
  it('Check the selectCheckbox', () => {
    const selectHoldings = screen.getByText(/Select holdings/i);
    const accordion = screen.getByText(/Accordion/i);
    expect(selectHoldings).toBeInTheDocument();
    expect(accordion).toBeInTheDocument();
    const selectCheckbox = screen.getByRole('checkbox', { id: 'select-holding-1' });
    fireEvent.click(selectCheckbox);
    expect(selectCheckbox).toBeChecked();
  });
});
