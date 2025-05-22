import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHoldingQuery,
} from '../../common/hooks';
import { useItemQuery } from '../hooks';
import DuplicateItem from './DuplicateItem';

jest.mock('../../edit/items/ItemForm', () => jest.fn().mockReturnValue('ItemForm'));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHoldingQuery: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useItemQuery: jest.fn().mockReturnValue({ item: {}, isLoading: false }),
}));

const defaultProps = {
  instanceId: instance.id,
  itemId: 'itemId',
  holdingId: 'holdingId',
  referenceData: {},
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderDuplicateItem = (props = {}) => render(
  <DuplicateItem
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);


describe('DuplicateItem', () => {
  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHoldingQuery.mockClear();
    useItemQuery.mockClear();
  });

  it('should render ItemForm', () => {
    renderDuplicateItem();

    expect(screen.getByText('ItemForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderDuplicateItem();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });
});
