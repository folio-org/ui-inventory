import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import CirculationHistory from './CirculationHistory';

const mockCirculation = {
  checkInDate: '2024-02-26T12:00:00Z',
  servicePointName: 'servicePointName',
  source: 'source',
};

const renderCirculationHistory = (circulationHistory = mockCirculation) => {
  return renderWithIntl(<CirculationHistory circulationHistory={circulationHistory} />, translationsProperties);
};

describe('CirculationHistory', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderCirculationHistory();
    await runAxeTest({ rootNode: container });
  });

  it('should render Circulation history accordion', () => {
    renderCirculationHistory();

    expect(screen.getByText('Circulation history')).toBeInTheDocument();
  });

  it('should render proper field values', () => {
    renderCirculationHistory();

    expect(screen.getByText('Check in date')).toBeInTheDocument();
    expect(screen.getByText('2024-02-26T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('Service point')).toBeInTheDocument();
    expect(screen.getByText('servicePointName')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('source')).toBeInTheDocument();
  });
});

