import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../../../../../test/jest/__mock__';
import { Router } from 'react-router';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { createMemoryHistory } from 'history';
import { renderWithIntl, translationsProperties } from '../../../../../../test/jest/helpers';
import useLoadSubInstances from '../../../../../hooks/useLoadSubInstances';

import SubInstanceList from './SubInstanceList';

const mockuseLoadSubInstancesVaues = [
  {
    id: '1',
    title: 'Test Title 1',
    hrid: 'TestHrid1',
    publication: [{ publisher: 'Test Publisher 1', dateOfPublication: '04-17-2023' }],
    identifiers: [
      { identifierTypeId: 'ISBN', value: '369369' },
    ]
  },
  {
    id: '2',
    title: 'Test Title 2',
    hrid: 'TestHrid2',
    publication: [{ publisher: 'Test Publisher 2', dateOfPublication: '04-17-2023' }],
    identifiers: [
      { identifierTypeId: 'ISSN', value: '789789' },
    ],
  }
];

const history = createMemoryHistory();
const defaultProps = {
  id: 'TestID',
  label: 'LabelTest',
  titles: [{}],
  titleKey: 'id',
};

const queryClient = new QueryClient();
const renderSubInstanceList = (props) => renderWithIntl(
  <Router history={history}>
    <QueryClientProvider client={queryClient}>
      <SubInstanceList {...props} />
    </QueryClientProvider>
  </Router>,
  translationsProperties
);


jest.mock('../../../../../hooks/useReferenceData', () => jest.fn().mockReturnValue({
  identifierTypesById : {
    'ISBN': { name : 'ISBN' },
    'ISSN': { name : 'ISSN' }
  }
}));
jest.mock('../../../../../hooks/useLoadSubInstances', () => jest.fn());


describe('render SubInstanceList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('NoValue should display when no title is present', () => {
    useLoadSubInstances.mockReturnValue([{}]);
    const { getAllByText } = renderSubInstanceList(defaultProps);
    expect(getAllByText(/No value set/i).length).toBe(6);
  });
  it('No link to be present when tittleKey is empty', () => {
    useLoadSubInstances.mockReturnValue(mockuseLoadSubInstancesVaues);
    const { container, getByText } = renderSubInstanceList({ ...defaultProps, titleKey: '' });
    expect(getByText('Test Title 1')).toBeInTheDocument();
    expect(getByText('Test Title 1')).not.toHaveAttribute('href');
    expect(getByText('Test Title 2')).toBeInTheDocument();
    expect(getByText('Test Title 2')).not.toHaveAttribute('href');
    expect(container.getElementsByTagName('a').length).toBe(0);
  });
  it('Link to a title to be present when title and tittleKey is present', () => {
    useLoadSubInstances.mockReturnValue(mockuseLoadSubInstancesVaues);
    const { container, getByText } = renderSubInstanceList(defaultProps);
    expect(getByText('Test Title 1')).toHaveAttribute('href', '/inventory/view/1');
    expect(getByText('Test Title 2')).toHaveAttribute('href', '/inventory/view/2');
    expect(container.getElementsByTagName('a').length).toBe(2);
  });
  it('Pagination message to be render on clicking next button', () => {
    useLoadSubInstances.mockReturnValue(mockuseLoadSubInstancesVaues);
    const { container, getByRole } = renderSubInstanceList(defaultProps);
    userEvent.click(getByRole('button', { name: 'Next' }));
    expect(container.getElementsByClassName('sr-only').length).toBe(3);
  });
});
