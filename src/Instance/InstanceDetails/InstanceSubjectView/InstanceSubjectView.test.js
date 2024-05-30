import React from 'react';

import '../../../../test/jest/__mock__';

import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { segments } from '@folio/stripes-inventory-components';

import { DataContext } from '../../../contexts';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import InstanceSubjectView from './InstanceSubjectView';

const history = createMemoryHistory();

const defaultProps = {
  id: 'subject-accordion',
  subjects: ['Subject 1'],
};

const renderInstanceSubjectView = (props) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value="Subject">
      <InstanceSubjectView
        source="MARC"
        segment={segments.instances}
        {...props}
      />
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('InstanceSubjectView', () => {
  it('renders InstanceSubjectView component', () => {
    const { getByText, getByRole } = renderInstanceSubjectView({ ...defaultProps });
    const subjectButton = getByRole('button', { name: /Subject/i });
    userEvent.click(subjectButton);
    expect(getByText(/Subject headings/i)).toBeInTheDocument();
    expect(getByText(/No value set/i)).toBeInTheDocument();
    expect(getByText(/End of list/i)).toBeInTheDocument();
  });
});
