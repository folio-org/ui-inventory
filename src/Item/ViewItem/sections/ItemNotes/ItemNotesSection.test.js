import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemNotesSection from './ItemNotesSection';

jest.mock('../../components/ItemNotes/ItemNotes', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('ItemNotes'),
}));

const mockReferenceTables = {
  itemNoteTypes: [],
};

const defaultProps = {
  referenceTables: mockReferenceTables,
  item: { notes: [] },
};

const renderItemNotesSection = () => {
  const component = (
    <ItemNotesSection {...defaultProps} />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ItemNotesSection', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderItemNotesSection();
    await runAxeTest({ rootNode: container });
  });

  it('should render accordion with correct label', () => {
    renderItemNotesSection();

    expect(screen.getByRole('button', { name: 'Item notes' })).toBeInTheDocument();
  });

  it('should render Item notes component', () => {
    renderItemNotesSection();

    expect(screen.getByText('ItemNotes')).toBeInTheDocument();
  });
});

