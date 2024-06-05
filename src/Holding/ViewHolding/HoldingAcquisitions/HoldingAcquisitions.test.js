import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  holdingSummaries,
  holdingOrderLine,
} from './fixtures';
import HoldingAcquisitions from './HoldingAcquisitions';
import useHoldingOrderLines from './useHoldingOrderLines';

jest.mock('./useHoldingOrderLines', () => jest.fn());

const renderHoldingAcquisitions = ({
  holding = {},
  withSummary = true,
} = {}) => (
  renderWithIntl(
    <Router>
      <HoldingAcquisitions holding={holding} withSummary={withSummary} />
    </Router>
  )
);

describe('HoldingAcquisitions component', () => {
  beforeEach(() => {
    useHoldingOrderLines.mockClear().mockReturnValue({ holdingOrderLines: holdingSummaries });
  });

  it('should display acq holding fields', () => {
    renderHoldingAcquisitions({ holding: { id: 'holdingUid' }, withSummary: false });

    expect(screen.getByText('ui-inventory.acquisitionMethod')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.acquisitionFormat')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.receiptStatus')).toBeInTheDocument();
  });

  it('should display fetched order lines in table', () => {
    renderHoldingAcquisitions({ holding: { id: 'holdingUid' }, withSummary: true });

    expect(screen.getByText(holdingOrderLine.poLineNumber)).toBeInTheDocument();
  });

  it('should not display order lines table when summary is disabled', () => {
    renderHoldingAcquisitions({ holding: { id: 'holdingUid' }, withSummary: false });

    expect(screen.queryByText(holdingOrderLine.poLineNumber)).toBeNull();
  });
});
