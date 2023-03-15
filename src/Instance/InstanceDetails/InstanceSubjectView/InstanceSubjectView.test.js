import React from 'react';

import '../../../../test/jest/__mock__';

import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

import { DataContext } from '../../../contexts';

import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import InstanceSubjectView from './InstanceSubjectView';

const history = new createMemoryHistory();

const defaultProps = {
  id: 'test-id',
  subjects: ['subject1', 'subject2'],
  source: 'instanceSubjectSource'
};

const renderInstanceSubjectView = (props) => renderWithIntl(
  <Router history={history}>
    <DataContext.Provider value={{ id: 'test-id' }}>
      <InstanceSubjectView {...props} />
    </DataContext.Provider>
  </Router>,
  translationsProperties
);

describe('InstanceSubjectView', () => {
  it('renders InstanceSubjectView component', () => {
    const { getByText, getByRole } = renderInstanceSubjectView(defaultProps);
    const subjectButton = getByRole('button', { name: 'Subject' });
    userEvent.click(subjectButton);
    expect(getByText('Subject headings')).toBeInTheDocument();
  });
});
