import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import BoundPiecesData from './BoundPiecesData';

jest.mock('../../../../components', () => ({
  ...jest.requireActual('../../../../components'),
  BoundPiecesList: () => <div>BoundPiecesList</div>
}));

const renderBoundPiecesData = () => {
  return renderWithIntl(<BoundPiecesData itemId="itemId" instanceId="instanceId" />, translationsProperties);
};

describe('BoundPiecesData', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderBoundPiecesData();
    await runAxeTest({ rootNode: container });
  });

  it('should render BoundPiecesList', () => {
    renderBoundPiecesData();

    expect(screen.getByText('BoundPiecesList')).toBeInTheDocument();
  });
});
