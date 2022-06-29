import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import translations from '../../../../test/jest/helpers/translationsProperties';

import HoldingButtonsGroup from './HoldingButtonsGroup';

const mockItemCount = 3;

const HoldingButtonsGroupSetup = () => (
  <Router>
    <HoldingButtonsGroup
      withMoveDropdown={false}
      holding={{ id: '123' }}
      holdings={[]}
      locationsById={[]}
      onViewHolding={noop}
      onAddItem={noop}
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
});
