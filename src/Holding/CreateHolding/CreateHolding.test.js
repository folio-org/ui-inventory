/* eslint-disable import/no-unresolved */
import '../../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';
import { Promise } from 'core-js';
import { instance } from '../../../test/fixtures/instance';
import { useHolding, useInstance } from '../../common/hooks';
import { useHoldingMutation } from '../../hooks';
import HoldingsForm from '../../edit/holdings/HoldingsForm';
import CreateHolding from './CreateHolding';

jest.mock('../../edit/holdings/HoldingsForm', () => jest.fn().mockReturnValue('HoldingsForm'));
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useHoldingMutation: jest.fn().mockReturnValue({ mutateHolding: jest.fn() }),
}));
jest.mock('../../hooks/useCallout', () => jest.fn().mockReturnValue({ sendCallout: jest.fn() }));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useInstance: jest.fn().mockReturnValue({ instance: {}, isLoading: false }),
  useHolding: jest.fn().mockReturnValue({ holding: {}, isLoading: false }),
}));

const defaultProps = {
  goTo: jest.fn(),
  instanceId: instance.id,
  holdingId: 'holdingId',
  referenceData: {},
  mutator: {
    GET: jest.fn(() => Promise.resolve({ data: {} })),
    POST: jest.fn(() => Promise.resolve({ data: {} })),
    holding: {
      POST: jest.fn(() => Promise.resolve({ data: {} })),
    },
  },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </MemoryRouter>
);

const renderCreateHolding = (props = {}) => render(<CreateHolding {...defaultProps} {...props} />, { wrapper });

describe('CreateHolding', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    useInstance.mockClear();
    useHolding.mockClear();
    useHoldingMutation
      .mockClear()
      .mockReturnValue({ mutateHolding: mockMutate });
  });

  it('should render HoldingsForm', () => {
    renderCreateHolding();

    expect(screen.getByText('HoldingsForm')).toBeInTheDocument();
  });

  it('should render LoadingView if page is loading', () => {
    useInstance.mockReturnValue({ isLoading: true });

    renderCreateHolding();

    expect(screen.getByText('LoadingView')).toBeInTheDocument();
  });

  it('should call holding mutation when the holding form is submitted', () => {
    useInstance.mockReturnValue({ isLoading: false, instance: { id: 0 } });

    renderCreateHolding();
    HoldingsForm.mock.calls[0][0].onSubmit();
    expect(defaultProps.mutator.holding.POST).toBeCalled();
  });
});
