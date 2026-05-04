import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import InstanceEditRoute from './InstanceEditRoute';

const mockedUseParams = jest.fn();
const mockAuthenticatedError = jest.fn(({ location }) => (
  <div>AuthenticatedError: {location.pathname}</div>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  AuthenticatedError: (props) => mockAuthenticatedError(props),
}));

jest.mock('../contexts', () => ({
  DataContext: {
    Consumer: ({ children }) => children({}),
  },
}));

jest.mock('../Instance', () => ({
  InstanceEdit: jest.fn().mockReturnValue('InstanceEdit'),
}));

const renderInstanceEditRoute = (initialEntry = '/inventory/edit/foo') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <InstanceEditRoute
      location={{ search: '', state: {}, pathname: '/inventory/edit/foo' }}
      stripes={{ okapi: { tenant: 'diku' } }}
    />
  </MemoryRouter>,
);

describe('InstanceEditRoute', () => {
  beforeEach(() => {
    mockAuthenticatedError.mockClear();
  });

  it('renders authenticated error for invalid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: 'foo',
    });

    renderInstanceEditRoute();

    expect(screen.getByText('AuthenticatedError: /inventory/edit/foo')).toBeInTheDocument();
    expect(mockAuthenticatedError).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          pathname: '/inventory/edit/foo',
        }),
      }),
    );
  });

  it('renders instance edit for valid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: '11111111-1111-4111-8111-111111111111',
    });

    renderInstanceEditRoute('/inventory/edit/11111111-1111-4111-8111-111111111111');

    expect(screen.getByText('InstanceEdit')).toBeInTheDocument();
    expect(mockAuthenticatedError).not.toHaveBeenCalled();
  });
});
