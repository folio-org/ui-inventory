import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ViewHoldingRoute from './ViewHoldingRoute';

const mockSendCallout = jest.fn();

jest.mock('../ViewHoldingsRecord', () => jest.fn().mockReturnValue('ViewHoldingsRecord'));
jest.mock('../common', () => ({
  useSearchInstanceByIdQuery: jest.fn(),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useCallout: () => ({
    sendCallout: mockSendCallout,
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

const { useParams, useLocation } = require('react-router-dom');
const { useSearchInstanceByIdQuery } = require('../common');

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderViewHoldingRoute = (props = {}) => render(
  <ViewHoldingRoute
    {...props}
  />,
  { wrapper },
);

describe('ViewHoldingRoute', () => {
  beforeEach(() => {
    mockSendCallout.mockReset();

    useLocation.mockReturnValue({ pathname: '/inventory/view' });
    useParams.mockReturnValue({
      id: 'f58ba07d-3cab-4a2e-a22e-4f9df4174d0e',
      holdingsrecordid: 'f58ba07d-3cab-4a2e-a22e-4f9df4174d0f',
    });
    useSearchInstanceByIdQuery.mockReturnValue({
      instance: { shared: false },
      error: null,
    });
  });

  it('should render ViewHoldingsRecord component', () => {
    renderViewHoldingRoute();

    expect(screen.getByText('ViewHoldingsRecord')).toBeInTheDocument();
  });

  it('should render AuthenticatedError when holdingsrecordid is invalid UUID', () => {
    useParams.mockReturnValue({
      id: 'f58ba07d-3cab-4a2e-a22e-4f9df4174d0e',
      holdingsrecordid: 'bar',
    });

    renderViewHoldingRoute();

    expect(screen.getByText('AuthenticatedError')).toBeInTheDocument();
  });

  it('should trigger error callout when instance query fails', () => {
    useSearchInstanceByIdQuery.mockReturnValue({
      instance: null,
      error: new Error('Not found'),
    });

    renderViewHoldingRoute();

    expect(screen.getByText('ViewHoldingsRecord')).toBeInTheDocument();
    expect(mockSendCallout).toHaveBeenCalledWith({
      type: 'error',
      message: 'Not found',
      timeout: 0,
    });
  });
});
