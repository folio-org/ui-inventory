import React from 'react';
import { Router } from 'react-router';
import { noop } from 'lodash';
import '../../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../../test/jest/helpers/renderWithIntl';
import translationsProperties from '../../../../../../test/jest/helpers/translationsProperties';
import { instances as instancesFixture } from '../../../../../../test/fixtures/instances';
import StatisticalCodesList from './StatisticalCodesList';
import { QUERY_INDEXES } from '../../../../../constants';

const getHistory = search => ({
  length: 1,
  action: 'POP',
  location: {
    search,
  },
  block: noop,
  push: noop,
  replace: noop,
  listen: noop,
  createHref: noop,
  go: noop,
  goBack: noop,
  goForward: noop,
});

const defaultHRID = '11110000';

const searchInstance = qIndex => `?qindex=${qIndex}&query=${defaultHRID}`;

const setupStatisticalCodesList = ({
  instance = instancesFixture[0],
  history
}) => {
  const component = (
    <Router history={history}>
      <StatisticalCodesList
        id={instance.id}
        instance={{ ...instance, hrid: defaultHRID, metadata: null, discoverySuppress: true }}
      />
    </Router>
  );

  return renderWithIntl(
    component,
    translationsProperties
  );
};

describe('StatisticalCodesList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render and Statistical code, End of list type toBeInTheDocument', () => {
    const history = getHistory(searchInstance(QUERY_INDEXES.INSTANCE_HRID));
    const { getByText } = setupStatisticalCodesList({ history });
    expect(getByText(/Statistical code type/i)).toBeInTheDocument();
    expect(getByText(/End of list/i)).toBeInTheDocument();
  });
});
