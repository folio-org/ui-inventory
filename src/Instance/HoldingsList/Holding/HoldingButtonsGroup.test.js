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

const HoldingButtonsGroupSetup = () => (
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
    >
      {() => null}
    </HoldingButtonsGroup>
  </Router>
);

const renderHoldingButtonsGroup = () => renderWithIntl(
  <HoldingButtonsGroupSetup />,
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
