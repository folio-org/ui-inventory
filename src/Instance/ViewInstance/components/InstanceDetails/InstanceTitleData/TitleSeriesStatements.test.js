import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { segments } from '@folio/stripes-inventory-components';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import TitleSeriesStatements from './TitleSeriesStatements';

const seriesStatements = ['Statement 1', 'Statement 2'];

jest.mock('../ControllableDetail', () => ({
  ControllableDetail: jest.fn().mockReturnValue('ControllableDetail'),
}));

const props = {
  seriesStatements,
  segment: segments.instances,
  source: 'source-test'
};

const renderTitleSeriesStatements = () => (
  renderWithIntl(
    <Router>
      <TitleSeriesStatements {...props} />
    </Router>
  )
);

describe('TitleSeriesStatements', () => {
  it('Should renders correctly', () => {
    const { getByRole } = renderTitleSeriesStatements();
    const list = getByRole('grid');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('id', 'list-series-statement');
    expect(screen.getByText(/ui-inventory.seriesStatement/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ControllableDetail/i)).toBeTruthy();
  });
});
