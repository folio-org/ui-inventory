import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  boundWithItems,
  boundWithHoldingsRecords,
} from './fixtures';
import HoldingBoundWith from './HoldingBoundWith';
import useBoundWithItems from './useBoundWithItems';
import useBoundWithHoldings from './useBoundWithHoldings';

jest.mock('./useBoundWithItems', () => jest.fn());
jest.mock('./useBoundWithHoldings', () => jest.fn());

const renderHoldingBoundWith = ({
  boundWithParts = [],
} = {}) => (
  renderWithIntl(
    <Router>
      <HoldingBoundWith boundWithParts={boundWithParts} />
    </Router>
  )
);

describe('HoldingBoundWith', () => {
  beforeEach(() => {
    useBoundWithItems.mockClear().mockReturnValue({ boundWithItems });
    useBoundWithHoldings.mockClear().mockReturnValue({ boundWithHoldingsRecords });
  });

  it('should display bound-with fields', () => {
    renderHoldingBoundWith([{ itemId: 'f4b8c3d1-f461-4551-aa7b-5f45e64f236c' }]);

    expect(screen.getByText('ui-inventory.itemHrid')).toBeInTheDocument();
  });
});
