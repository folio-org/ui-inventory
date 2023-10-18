import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import { switchAffiliation } from '../../../utils';

import HoldingButtonsGroup from './HoldingButtonsGroup';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  switchAffiliation: jest.fn(),
}));

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
      showViewHoldingsButton
      showAddItemButton
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

    expect(getByRole('button', { name: 'View holdings' })).toBeDefined();
    expect(getByRole('button', { name: 'Add item' })).toBeDefined();
  });

  describe('when user has no permissions to view holdings', () => {
    it('should supress "View Holdings" button', () => {
      const { queryByRole } = renderHoldingButtonsGroup({ showViewHoldingsButton: false });

      expect(queryByRole('button', { name: 'View holdings' })).not.toBeInTheDocument();
    });
  });

  describe('when user has no permissions to create items', () => {
    it('should supress "Add item" button', () => {
      const { queryByRole } = renderHoldingButtonsGroup({ showAddItemButton: false });

      expect(queryByRole('button', { name: 'Add item' })).not.toBeInTheDocument();
    });
  });

  describe('when user click on View holdings button', () => {
    it('should call function to switch user\'s affiliation', () => {
      const { getByRole } = renderHoldingButtonsGroup();

      fireEvent.click(getByRole('button', { name: 'View holdings' }));

      expect(switchAffiliation.mock.calls.length).toBe(1);
    });
  });

  describe('when user click on Add item button', () => {
    it('should call function to switch user\'s affiliation', () => {
      const { getByRole } = renderHoldingButtonsGroup();

      fireEvent.click(getByRole('button', { name: 'Add item' }));

      expect(switchAffiliation.mock.calls.length).toBe(1);
    });
  });
});
