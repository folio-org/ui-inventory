import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../../../../../test/jest/__mock__';

import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../../../test/jest/helpers/translationsProperties';
import InstanceContributorsView from './InstanceContributorsView';

jest.mock('../ControllableDetail', () => ({
  ControllableDetail: jest.fn().mockReturnValue('ControllableDetail'),
}));

const contributors = [
  {
    id: 1,
    name: 'contributors name 1',
    contributorTypeId: 1,
    contributorNameTypeId: 1,
    primary: true,
  },
  {
    id: 2,
    name: 'contributors name 2',
    contributorTypeId: 2,
    contributorNameTypeId: 2,
    primary: false,
  },
];

const contributorTypes = [
  {
    id: 1,
    name: 'Author',
  },
  {
    id: 2,
    name: 'Editor',
  },
];

const contributorNameTypes = [
  {
    id: 1,
    name: 'Personal',
  },
  {
    id: 2,
    name: 'Corporate',
  },
];

const props = {
  id: 'instance-contributors',
  contributors,
  contributorTypes,
  contributorNameTypes,
  source: 'local',
  segment: 'instance',
};

const noValueProps = {
  id: 'instance-contributors',
  contributors: [],
  contributorTypes: [],
  contributorNameTypes: [],
  source: 'local',
  segment: 'instance',
};

const history = createMemoryHistory();

const renderComponent = () => renderWithIntl(
  <Router history={history}>
    <InstanceContributorsView {...props} />
  </Router>,
  translationsProperties,
);

const renderNoValueComponent = () => renderWithIntl(
  <Router history={history}>
    <InstanceContributorsView {...noValueProps} />
  </Router>,
  translationsProperties,
);

describe('InstanceContributorsView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with the given props', () => {
    const { getByRole, getByText } = renderComponent();
    expect(getByText('Name type')).toBeInTheDocument();
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('Type')).toBeInTheDocument();
    expect(getByText('Free text')).toBeInTheDocument();
    expect(screen.getAllByText('ControllableDetail')).toBeTruthy();
    expect(getByText('Personal')).toBeInTheDocument();
    const ContributorButton = getByRole('button', { name: 'Contributor' });
    userEvent.click(ContributorButton);
  });
  it('InstanceContributorsView with noValue props', () => {
    const { getAllByText } = renderNoValueComponent();
    expect(getAllByText('No value set')).toBeTruthy();
  });
});
