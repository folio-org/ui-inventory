import { act } from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemNotes from './ItemNotes';

const noteTypes = [
  { id: '1', name: 'Note Type 1' },
  { id: '2', name: 'Note Type 2' },
];

const renderItemNotes = (notes = []) => {
  const component = <ItemNotes notes={notes} noteTypes={noteTypes} />;

  return renderWithIntl(component, translationsProperties);
};

describe('ItemNotes', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = await act(async () => renderItemNotes());

    await runAxeTest({ rootNode: container });
  });

  it('should render empty "Staff only" and "Note" field values when no notes provided', () => {
    renderItemNotes([]);

    expect(screen.getByText('Staff only')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('should render "Staff only" and note values when notes provided', () => {
    const notes = [
      {
        itemNoteTypeId: '1',
        staffOnly: true,
        note: 'Test note 1',
      },
      {
        itemNoteTypeId: '1',
        staffOnly: false,
        note: 'Test note 2',
      },
    ];
    renderItemNotes(notes);

    expect(screen.getByText('Note Type 1')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Test note 1')).toBeInTheDocument();
    expect(screen.getByText('Test note 2')).toBeInTheDocument();
  });

  it('should render NoValue component when note text is empty', () => {
    const notes = [
      {
        itemNoteTypeId: '1',
        staffOnly: true,
        note: '',
      },
    ];
    renderItemNotes(notes);

    expect(screen.getByText('Note Type 1')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should only render note types that have associated notes', () => {
    const notes = [
      {
        itemNoteTypeId: '1',
        staffOnly: true,
        note: 'Test note 1',
      },
    ];
    renderItemNotes(notes);

    expect(screen.getByText('Note Type 1')).toBeInTheDocument();
    expect(screen.queryByText('Note Type 2')).not.toBeInTheDocument();
  });
});
