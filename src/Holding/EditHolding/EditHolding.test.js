import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHoldingQuery,
} from '../../common/hooks';
import {
  useHoldingItemsQuery,
  useHoldingMutation,
} from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import EditHolding from './EditHolding';

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallout: () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }),
  useHoldingItemsQuery: jest.fn().mockReturnValue({ totalRecords: 1, isLoading: false }),
  useHoldingMutation: jest.fn().mockReturnValue({ mutateHolding: jest.fn() }),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHoldingQuery: jest.fn().mockReturnValue({ holding: {}, isFetching: false }),
}));

const defaultProps = {
  goTo: jest.fn(),
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceTables: { holdingsSources: [{ id: 'sourceId' }] },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderEditHolding = (props = {}) => render(
  <EditHolding
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('EditHolding', () => {
  const mutateHolding = jest.fn(() => Promise.resolve({ data: {} }));

  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHoldingQuery.mockClear();
    useHoldingItemsQuery.mockClear();
    useHoldingMutation.mockClear().mockReturnValue({ mutateHolding });
  });

  it('should render HoldingsForm', () => {
    renderEditHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderEditHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should call holding mutation when the holding form is submitted', () => {
    renderEditHolding();

    HoldingsForm.mock.calls[0][0].onSubmit({
      id: 'holdingId',
      permanentLocationId: '',
      temporaryLocationId: '',
    });

    expect(mutateHolding).toHaveBeenCalled();
  });

  it('should handle optimistic locking exception', () => {
    const error = new Error({ response: 'optimistic locking' });
    mutateHolding.mockClear().mockImplementation(() => Promise.reject(error));

    renderEditHolding();

    HoldingsForm.mock.calls[0][0].onSubmit({
      id: 'holdingId',
      permanentLocationId: '',
      temporaryLocationId: '',
    });

    expect(mutateHolding).toHaveBeenCalled();
  });
});
