import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { instance } from '../../../test/fixtures/instance';
import {
  useInstanceQuery,
  useHoldingQuery,
} from '../../common/hooks';
import { useHoldingMutation } from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import DuplicateHolding from './DuplicateHolding';

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useCallout: () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }),
  useHoldingMutation: jest.fn().mockReturnValue({ mutateHolding: jest.fn() }),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstanceQuery: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHoldingQuery: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));

const defaultProps = {
  goTo: jest.fn(),
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceTables: {},
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderDuplicateHolding = (props = {}) => render(
  <DuplicateHolding
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('DuplicateHolding', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    useInstanceQuery.mockClear();
    useHoldingQuery.mockClear();
    useHoldingMutation.mockClear().mockReturnValue({ mutateHolding: mockMutate });
  });

  it('should render HoldingsForm', () => {
    renderDuplicateHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstanceQuery.mockReturnValue({ isLoading: true });

    renderDuplicateHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should call holding mutation when the holding form is submitted', () => {
    renderDuplicateHolding();

    HoldingsForm.mock.calls[0][0].onSubmit();

    expect(mockMutate).toHaveBeenCalled();
  });
});
