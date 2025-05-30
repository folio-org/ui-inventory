import { act } from 'react';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import ItemNotes from './ItemNotes';

const renderItemNotes = (notes = []) => {
  const component = <ItemNotes notes={notes}/>;

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
    const notes = [{
      staffOnly: {
        label: 'Staff only',
        value: 'Yes',
      },
      noteType: {
        label: 'Note Type 1',
        value: 'Test note 1',
      },
    }, {
      staffOnly: {
        label: 'Staff only',
        value: 'No',
      },
      noteType: {
        label: 'Note Type 2',
        value: 'Test note 2',
      },
    }];
    renderItemNotes(notes);

    expect(screen.getByText('Note Type 1')).toBeInTheDocument();
    expect(screen.getByText('Note Type 2')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Test note 1')).toBeInTheDocument();
    expect(screen.getByText('Test note 2')).toBeInTheDocument();
  });

  it('should render NoValue component when note text is empty', () => {
    const notes = [{
      staffOnly: {
        label: 'Staff only',
        value: 'Yes',
      },
      noteType: {
        label: 'Note Type 1',
        value: '',
      },
    }];
    renderItemNotes(notes);

    expect(screen.getByText('Note Type 1')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
