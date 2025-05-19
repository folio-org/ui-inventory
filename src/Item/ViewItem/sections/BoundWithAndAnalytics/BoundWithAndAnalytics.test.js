import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import BoundWithAndAnalytics from './BoundWithAndAnalytics';

const mockBoundWithTitles = [{
  briefInstance: { id: 'briefInstance', hrid: 'instance-hrid', title: 'Title' },
  briefHoldingsRecord: { id: 'briefHoldingsRecord', hrid: 'holdings-hrid' },
}];

const renderBoundWithAndAnalytics = (boundWithTitles = mockBoundWithTitles) => {
  const component = (
    <Router>
      <BoundWithAndAnalytics boundWithTitles={boundWithTitles} />
    </Router>
  );
  return renderWithIntl(component, translationsProperties);
};

describe('BoundWithAndAnalytics', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderBoundWithAndAnalytics();
    await runAxeTest({ rootNode: container });
  });

  it('should render Bound-with and analytics list', () => {
    renderBoundWithAndAnalytics();

    expect(screen.getByText('Bound-with and analytics')).toBeInTheDocument();
  });

  it('should render NoValue if data is missing', () => {
    renderBoundWithAndAnalytics([]);

    expect(screen.getAllByText('-')).toHaveLength(3);
  });

  it('should render table with data', () => {
    renderBoundWithAndAnalytics();

    expect(screen.getByText('Instance HRID')).toBeInTheDocument();
    expect(screen.getByText('Instance title')).toBeInTheDocument();
    expect(screen.getByText('Holdings HRID')).toBeInTheDocument();
    expect(screen.getByText('holdings-hrid')).toBeInTheDocument();
    expect(screen.getByText('instance-hrid')).toBeInTheDocument();
  });
});
