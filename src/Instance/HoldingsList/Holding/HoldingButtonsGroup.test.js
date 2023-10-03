import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import HoldingButtonsGroup from './HoldingButtonsGroup';

const mockItemCount = 3;
const mockOnAddItem = jest.fn();
const mockOnViewHolding = jest.fn();

const HoldingButtonsGroupSetup = props => (
  <Router>
    <HoldingButtonsGroup
      withMoveDropdown={false}
      holding={{ id: '123' }}
      holdings={[]}
      locationsById={[]}
      onViewHolding={mockOnViewHolding}
      onAddItem={mockOnAddItem}
      itemCount={mockItemCount}
      isOpen={false}
      isViewHoldingsDisabled={false}
      isAddItemDisabled={false}
      {...props}
    >
      {() => null}
    </HoldingButtonsGroup>
  </Router>
);

const renderHoldingButtonsGroup = props => renderWithIntl(
  <HoldingButtonsGroupSetup {...props} />,
  translations
);

describe('HoldingButtonsGroup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderHoldingButtonsGroup();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display buttons', () => {
    const { getByRole } = renderHoldingButtonsGroup();

    expect(getByRole('button', { name:  'View holdings' })).toBeDefined();
    expect(getByRole('button', { name:  'Add item' })).toBeDefined();
  });

  describe('when user has no permissions to view holdings', () => {
    it('should render "View Holdings" button as disabled', () => {
      const { getByRole } = renderHoldingButtonsGroup({ isViewHoldingsDisabled: true });

      expect(getByRole('button', { name:  'View holdings' })).toBeDisabled();
    });
  });

  describe('when user has no permissions to create items', () => {
    it('should render "Add item" button as disabled', () => {
      const { getByRole } = renderHoldingButtonsGroup({ isAddItemDisabled: true });

      expect(getByRole('button', { name:  'Add item' })).toBeDisabled();
    });
  });

  describe('when user click on View holdings button', () => {
    it('should calls callback', () => {
      const { getByRole } = renderHoldingButtonsGroup();

      fireEvent.click(getByRole('button', { name:  'View holdings' }));

      expect(mockOnViewHolding.mock.calls.length).toBe(1);
    });
  });

  describe('when user click on Add item button', () => {
    it('should calls callback', () => {
      const { getByRole } = renderHoldingButtonsGroup();

      fireEvent.click(getByRole('button', { name:  'Add item' }));

      expect(mockOnAddItem.mock.calls.length).toBe(1);
    });
  });
});
