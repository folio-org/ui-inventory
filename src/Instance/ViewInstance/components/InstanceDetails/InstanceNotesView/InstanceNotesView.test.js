import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import InstanceNotesView from './InstanceNotesView';

const props1 = {
  id: 'notes',
  instance: {
    id: '1',
    title: 'Book Title',
    notes: [{ id: '1', note: 'Note 1', instanceNoteTypeId: '1', staffOnly: true }],
  },
  noteTypes: [{ id: '1', name: 'Note Type 1' }],
};

const instanceProps = {
  id: 'notes',
  instance: {},
  noteTypes: [{ id: '1', name: 'Note Type 1' }],
};

const noteProps = {
  id: 'notes',
  instance: { notes: [{ id: '1', instanceNoteTypeId: '3' }] },
  noteTypes: [{ id: '1', name: 'Note Type 1' }],
};

const renderInstanceNotesView = (props) => (
  renderWithIntl(
    <Router>
      <InstanceNotesView {...props} />
    </Router>
  )
);

describe('InstanceNotesView', () => {
  it('Should renders correctly and click the button', () => {
    const { getByText, getByRole } = renderInstanceNotesView(props1);
    const instanceButton = getByRole('button', { name: 'ui-inventory.instanceNotes' });
    fireEvent.click(instanceButton);
    expect(instanceButton).toHaveAttribute('aria-expanded', 'false');
    expect(getByText('ui-inventory.staffOnly')).toBeInTheDocument();
    expect(getByText('Note Type 1')).toBeInTheDocument();
    expect(getByText('Note 1')).toBeInTheDocument();
    expect(getByText('ui-inventory.yes')).toBeInTheDocument();
    expect(getByText('stripes-components.endOfList')).toBeInTheDocument();
  });
  it('renders an empty note type if instance notes are empty', () => {
    const { getByText } = renderInstanceNotesView(instanceProps);
    expect(getByText('ui-inventory.note')).toBeInTheDocument();
  });
  it('renders an unknown note type if note type name is undefined', () => {
    const { getByText } = renderInstanceNotesView(noteProps);
    expect(getByText('ui-inventory.unknownNoteType')).toBeInTheDocument();
  });
});
