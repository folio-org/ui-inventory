import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';
import InstanceTitleData from './InstanceTitleData';

jest.mock('../../../../../components/ViewSource/ViewSource', () => ({
  ViewSource: jest.fn(() => 'ViewSource mocked TitleField'),
}));

const instance =
  {
    id: '1',
    alternativeTitle: 'Alternative Title 1',
    alternativeTitleTypeId: '1',
    source: 'test',
  };

const titleTypes = [
  { id: '1', name: 'Type 1' },
  { id: '2', name: 'Type 2' },
];

const props = {
  instance,
  titleTypes,
  id: 'ui-inventory.titleData',
  segment: 'instances'
};

const renderInstanceTitleData = () => (
  renderWithIntl(
    <Router>
      <InstanceTitleData {...props} />
    </Router>
  )
);

describe('InstanceTitleData', () => {
  it('renders a MultiColumnList with the correct props', () => {
    const { queryAllByText } = renderInstanceTitleData();
    expect(screen.getByText('ui-inventory.resourceTitle')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.alternativeTitleType')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.alternativeTitle')).toBeInTheDocument();
    expect(queryAllByText('stripes-components.noValue.noValueSet')).toBeTruthy();
    expect(queryAllByText('stripes-components.endOfList')).toBeTruthy();
  });
  it('Button should have attibute accordion-toggle-button-ui-inventory.titleData', () => {
    renderInstanceTitleData();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('id', 'accordion-toggle-button-ui-inventory.titleData');
  });
});
