import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHolding,
} from '../../common/hooks';
import { useItem, useItemMutation, useBoundWithsMutation } from '../hooks';
import EditItem from './EditItem';
import ItemForm from '../../edit/items/ItemForm';

jest.mock('../../edit/items/ItemForm', () => jest.fn().mockReturnValue('ItemForm'));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useItem: jest.fn().mockReturnValue({ item: {}, isLoading: false }),
  useItemMutation: jest.fn().mockReturnValue({
    mutateItem: jest.fn()
  }),
  useBoundWithsMutation: jest.fn().mockReturnValue({
    mutateBoundWiths: jest.fn(() => Promise.resolve({ data: {} }))
  }),
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

const renderEditItem = (props = {}) => render(
  <EditItem
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('EditItem', () => {
  const mutateItem = jest.fn(() => Promise.resolve({ data: {} }));

  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHolding.mockClear();
    useItem.mockClear();
    useItemMutation.mockClear().mockReturnValue({ mutateItem });
    useBoundWithsMutation.mockClear();
  });

  it('should render ItemForm', () => {
    renderEditItem();

    expect(screen.getByText('ItemForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderEditItem();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });


  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderEditItem();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should handle optimistic locking exception', async () => {
    const error = new Error({ response: 'optimistic locking' });
    mutateItem.mockClear().mockImplementation(() => Promise.reject(error));

    renderEditItem();
    ItemForm.mock.calls[0][0].onSubmit({
      id: 'itemId',
      permanentLocationId: '',
      temporaryLocationId: '',
      boundWithTitles: [],
    });

    await waitFor(() => expect(mutateItem).toHaveBeenCalled());
  });

  it('should work even with undefined boundWithTitles', async () => {
    const error = new Error({ response: 'optimistic locking with no bound-with titles' });
    mutateItem.mockClear().mockImplementation(() => Promise.reject(error));

    renderEditItem();
    ItemForm.mock.calls[0][0].onSubmit({
      id: 'itemId',
      permanentLocationId: '',
      temporaryLocationId: '',
      // no boundWithTitles
    });

    await waitFor(() => expect(mutateItem).toHaveBeenCalled());
  });
});
