import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import { renderWithIntl } from '../../../../test/jest/helpers';

import { resultData, line } from './fixtures';
import TenantAcquisition from './TenantAcquisition';

const renderTenantAcquisition = () => (
  renderWithIntl(
    <Router>
      <TenantAcquisition
        acquisitions={resultData}
        isLoading={false}
        tenantId="diku"
      />
    </Router>
  )
);

describe('TenantAcquisition', () => {
  it('should display instance acquisition data', () => {
    renderTenantAcquisition();

    expect(screen.getByText(line.poLineNumber)).toBeInTheDocument();
  });
});
