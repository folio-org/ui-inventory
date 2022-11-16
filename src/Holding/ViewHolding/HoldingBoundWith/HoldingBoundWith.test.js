import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  boundWithHoldingsRecords,
} from './fixtures';
import HoldingBoundWith from './HoldingBoundWith';
import useBoundWithHoldings from './useBoundWithHoldings';

jest.mock('./useBoundWithHoldings', () => jest.fn());

const renderHoldingBoundWith = ({
  boundWithItems = [],
} = {}) => (
  renderWithIntl(
    <Router>
      <HoldingBoundWith boundWithItems={boundWithItems} />
    </Router>
  )
);

describe('HoldingBoundWith', () => {
  beforeEach(() => {
    useBoundWithHoldings.mockClear().mockReturnValue({ boundWithHoldingsRecords });
  });

  it('should display bound-with fields', () => {
    renderHoldingBoundWith([{ hrid: 'BW-ITEM-1' }]);

    expect(screen.getByText('ui-inventory.itemHrid')).toBeInTheDocument();
  });
});
