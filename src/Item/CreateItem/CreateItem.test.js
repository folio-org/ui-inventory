import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHolding,
} from '../../common/hooks';
import CreateItem from './CreateItem';

jest.mock('../../edit/items/ItemForm', () => jest.fn().mockReturnValue('ItemForm'));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));

const defaultProps = {
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceData: {},
}

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
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
