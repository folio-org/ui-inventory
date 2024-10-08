import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { holdingSummaries } from './fixtures';

import HoldingAcquisitionList from './HoldingAcquisitionList';

const renderHoldingAcquisitionList = (isActiveTenantAcquisition = false) => (
  renderWithIntl(
    <Router>
      <HoldingAcquisitionList
        holdingOrderLines={holdingSummaries}
        isLoading={false}
        tenantId="diku"
        isActiveTenantAcquisition={isActiveTenantAcquisition}
      />
    </Router>,
    translationsProperties,
  )
);

describe('HoldingAcquisitionList component', () => {
  it('should render correct column headers', () => {
    renderHoldingAcquisitionList();

    expect(screen.getByText('POL number')).toBeInTheDocument();
    expect(screen.getByText('Order status')).toBeInTheDocument();
    expect(screen.getByText('POL receipt status')).toBeInTheDocument();
    expect(screen.getByText('Order sent date')).toBeInTheDocument();
    expect(screen.getByText('Order type')).toBeInTheDocument();
  });

  it('should render acquisitions data', () => {
    renderHoldingAcquisitionList();

    expect(screen.getByText(holdingSummaries[0].orderStatus)).toBeInTheDocument();
    expect(screen.getByText(holdingSummaries[0].poLineNumber)).toBeInTheDocument();
    expect(screen.getByText(holdingSummaries[0].orderType)).toBeInTheDocument();
  });

  describe('when active tenant has acquisitions', () => {
    it('should render PO line as a link', () => {
      renderHoldingAcquisitionList(true);

      const link = screen.getByText(holdingSummaries[0].poLineNumber);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/orders/lines/view/${holdingSummaries[0].poLineId}`);
    });
  });

  describe('when central tenant has acquisitions', () => {
    it('should render PO line as a plain text', () => {
      renderHoldingAcquisitionList();

      const poLineNumber = screen.getByText(holdingSummaries[0].poLineNumber);

      expect(poLineNumber).toBeInTheDocument();
      expect(poLineNumber).not.toHaveAttribute('href', `/orders/lines/view/${holdingSummaries[0].poLineId}`);
    });
  });
});
