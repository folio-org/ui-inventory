import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../../test/jest/__mock__';
import { renderWithIntl } from '../../../../../../test/jest/helpers';

import { resultData, line } from './fixtures';
import TenantAcquisition from './TenantAcquisition';

const renderTenantAcquisition = (isActiveTenantAcquisition = false) => (
  renderWithIntl(
    <Router>
      <TenantAcquisition
        acquisitions={resultData}
        isLoading={false}
        tenantId="diku"
        isActiveTenantAcquisition={isActiveTenantAcquisition}
      />
    </Router>
  )
);

describe('TenantAcquisition', () => {
  it('should display instance acquisition data', () => {
    renderTenantAcquisition();

    expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
  });

  describe('when active tenant has acquisitions', () => {
    it('should render PO line as a link', () => {
      renderTenantAcquisition(true);

      const link = screen.getByText(line.poLineNumber);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/orders/lines/view/${line.id}`);
    });
  });

  describe('when central tenant has acquisitions', () => {
    it('should render PO line as a plain text', () => {
      renderTenantAcquisition();

      const poLineNumber = screen.getByText(line.poLineNumber);

      expect(poLineNumber).toBeInTheDocument();
      expect(poLineNumber).not.toHaveAttribute('href', `/orders/lines/view/${line.id}`);
    });
  });
});
