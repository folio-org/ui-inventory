import React from 'react';
import { screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../../../../test/jest/__mock__';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { renderWithIntl, translationsProperties } from '../../../../test/jest/helpers';

import SubInstanceList from './SubInstanceList';

const mockUseCallout = jest.fn();
const history = createMemoryHistory();
const defaultProps = {
  id: 'SubInstance TestID',
  label: 'SubInstance LabelTest',
  titles: [
    {
      id: '1',
      title: 'SubInstanceList Title 1',
      hrid: 'SubInstanceList-hrid-1',
      publication: [{ publisher: 'Test Publisher 1', dateOfPublication: '2023-04-05' }],
      identifiers: [
        { identifierTypeId: '1', value: '1111111111' },
        { identifierTypeId: '2', value: '2222222222' },
      ],
    },
    {
      id: '2',
      title: 'Test Title 2',
      hrid: 'testSubInstanceList-hrid-2',
      publication: [{ publisher: 'Test Publisher 2', dateOfPublication: '2022-02-01' }],
      identifiers: [
        { identifierTypeId: '2', value: '3333333333' },
        { identifierTypeId: '3', value: '4444444444' },
      ],
    }
  ],
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

jest.mock('../../../hooks/useReferenceData', () => jest.fn().mockReturnValue({
  identifierTypesById : 'id'
}));

jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useCallout: mockUseCallout,
}));

jest.mock('../../../hooks/useLoadSubInstances', () => jest.fn().mockReturnValue(
  [
    {
      id: '1',
      title: 'SubInstanceList Title 1',
      hrid: 'SubInstanceList-hrid-1',
      publication: [
        { publisher: 'Test Publisher 1', dateOfPublication: '2023-04-05' }
      ],
      identifiers: [
        { identifierTypeId: '1', value: '369369' },
        { identifierTypeId: '2', value: '786786' },
      ]
    }
  ]
));

describe('render SubInstanceList', () => {
  it('render message by clicking on [Next] button', () => {
    const { container } = renderSubInstanceList(defaultProps);
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(container.getElementsByClassName('sr-only').length).toBe(1);
  });
});
