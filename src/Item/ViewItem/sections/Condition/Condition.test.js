import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import Condition from './Condition';

const mockCondition = {
  numberOfMissingPieces: 2,
  missingPieces: 'missingPieces',
  missingPiecesDate: '2024-02-26T12:00:00Z',
  itemDamagedStatus: 'damagedStatus',
  itemDamagedStatusDate: '2024-04-26T12:00:00Z',
};

const renderCondition = (condition = mockCondition) => {
  return renderWithIntl(<Condition condition={condition} />, translationsProperties);
};

describe('Condition', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderCondition();
    await runAxeTest({ rootNode: container });
  });

  it('should render Condition accordion', () => {
    renderCondition();

    expect(screen.getByText('Condition')).toBeInTheDocument();
  });

  it('should render proper field values', () => {
    renderCondition();

    expect(screen.getByText('Number of missing pieces')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Missing pieces')).toBeInTheDocument();
    expect(screen.getByText('missingPieces')).toBeInTheDocument();
    expect(screen.getAllByText('Date')[0]).toBeInTheDocument();
    expect(screen.getByText('2024-02-26T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('Item damaged status')).toBeInTheDocument();
    expect(screen.getByText('damagedStatus')).toBeInTheDocument();
    expect(screen.getAllByText('Date')[1]).toBeInTheDocument();
    expect(screen.getByText('2024-04-26T12:00:00Z')).toBeInTheDocument();
  });
});
