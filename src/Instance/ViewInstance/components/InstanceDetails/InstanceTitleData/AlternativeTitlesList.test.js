import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';

import AlternativeTitlesList from './AlternativeTitlesList';

const titles = [
  {
    id: '1',
    alternativeTitle: 'Alternative Title 1',
    alternativeTitleTypeId: '1',
  },
  {
    id: '2',
    alternativeTitle: 'Alternative Title 2',
    alternativeTitleTypeId: '2',
  },
];

const titleTypes = [
  { id: '1', name: 'Type 1' },
  { id: '2', name: 'Type 2' },
];

const props = {
  titles,
  titleTypes,
};

const renderAlternativeTitlesList = () => (
  renderWithIntl(
    <Router>
      <AlternativeTitlesList {...props} />
    </Router>
  )
);

describe('AlternativeTitlesList', () => {
  it('renders a MultiColumnList with the correct props', () => {
    const { queryAllByText, getByRole } = renderAlternativeTitlesList();
    const list = getByRole('grid');
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute('id', 'list-alternative-titles');
    expect(queryAllByText('ui-inventory.alternativeTitleType')).toBeDefined();
    expect(queryAllByText('ui-inventory.alternativeTitle')).toBeTruthy();
    expect(queryAllByText('stripes-components.noValue.noValueSet')).toBeDefined();
    expect(queryAllByText('stripes-components.endOfList')).toBeTruthy();
  });
  it('formats the content data correctly', () => {
    const { getByText } = renderAlternativeTitlesList();
    expect(getByText('Type 1')).toBeInTheDocument();
    expect(getByText('Type 2')).toBeInTheDocument();
    expect(getByText('Alternative Title 1')).toBeInTheDocument();
    expect(getByText('Alternative Title 2')).toBeInTheDocument();
  });
});
