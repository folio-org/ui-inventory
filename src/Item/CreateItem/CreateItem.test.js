import '../../../test/jest/__mock__';

import { Router } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createMemoryHistory } from 'history';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHolding,
} from '../../common/hooks';
import CreateItem from './CreateItem';

jest.mock('../../edit/items/ItemForm', () => jest.fn().mockReturnValue('ItemForm'));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallout: () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }),
  useConfigurationQuery: () => ({ configs: {} }),
}));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));

const history = createMemoryHistory();
history.location = {
  pathname: '/testPathName',
  search: '?filters=test1',
  state: {
    tenantTo: 'testTenantToId',
    tenantFrom: 'testTenantFromId',
  }
};

const defaultProps = {
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceData: {},
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <Router history={history}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </Router>
);

const renderCreateItem = (props = {}) => render(
  <CreateItem
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);


describe('CreateItem', () => {
  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHolding.mockClear();
  });

  it('should render ItemForm', () => {
    renderCreateItem();

    expect(screen.getByText('ItemForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderCreateItem();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });
});
