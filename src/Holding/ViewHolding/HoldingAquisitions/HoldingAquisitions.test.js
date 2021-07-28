import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  holdingSummaries,
  holdingOrderLine,
} from './fixtures';
import HoldingAquisitions from './HoldingAquisitions';
import useHoldingOrderLines from './useHoldingOrderLines';

jest.mock('./useHoldingOrderLines', () => jest.fn());

const renderHoldingAquisitions = ({
  holding = {},
} = {}) => (
  renderWithIntl(
    <Router>
      <HoldingAquisitions holding={holding} />
    </Router>
  )
);

describe('HoldingAquisitions', () => {
  beforeEach(() => {
    useHoldingOrderLines.mockClear().mockReturnValue({ holdingOrderLines: holdingSummaries });
  });

  it('should display fetched order lines in table', () => {
    renderHoldingAquisitions({ id: 'holdingUid' });

    expect(screen.getByText(holdingOrderLine.poLineNumber)).toBeInTheDocument();
  });
});
