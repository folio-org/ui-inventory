import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHolding,
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
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
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
  const mockMutate = jest.fn();

  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHolding.mockClear();
    useHoldingItemsQuery.mockClear();
    useHoldingMutation.mockClear().mockReturnValue({ mutateHolding: mockMutate });
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

    expect(mockMutate).toHaveBeenCalled();
  });
});
