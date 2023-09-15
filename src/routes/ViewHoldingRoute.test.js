import '../../test/jest/__mock__';

import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import ViewHoldingRoute from './ViewHoldingRoute';

jest.mock('../ViewHoldingsRecord', () => jest.fn().mockReturnValue('ViewHoldingsRecord'));

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
  it('should render ViewHoldingsRecord component', () => {
    renderViewHoldingRoute();

    expect(screen.getByText('ViewHoldingsRecord')).toBeInTheDocument();
  });
});
