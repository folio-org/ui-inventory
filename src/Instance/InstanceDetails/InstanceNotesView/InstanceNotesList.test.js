import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import InstanceNotesList from './InstanceNotesList';

const props1 = {
  id: 'InstanceNotesListID',
  notesType: 'test-notes',
  notes: [{ staffOnly: true, note: 'Note 1' }],
};

const noValueProps = {
  id: 'test-id',
  notesType: 'test-notes',
  notes: [],
};

const renderInstanceNotesList = (props) => (
  renderWithIntl(
    <Router>
      <InstanceNotesList {...props} />
    </Router>
  )
);

describe('InstanceNotesList', () => {
  it('Should renders correctly', () => {
    const { getByText } = renderInstanceNotesList(props1);
    expect(getByText('ui-inventory.staffOnly')).toBeInTheDocument();
    expect(getByText('test-notes')).toBeInTheDocument();
    expect(getByText('ui-inventory.yes')).toBeInTheDocument();
    expect(getByText('Note 1')).toBeInTheDocument();
    expect(getByText('stripes-components.endOfList')).toBeInTheDocument();
  });
  it('should render the noValue component when notes is empty', () => {
    const { getAllByText } = renderInstanceNotesList(noValueProps);
    expect(getAllByText('stripes-components.noValue.noValueSet')).toBeDefined();
  });
});
