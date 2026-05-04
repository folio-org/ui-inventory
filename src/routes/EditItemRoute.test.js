import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import EditItemRoute from './EditItemRoute';

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

jest.mock('../Item', () => ({
  EditItem: jest.fn().mockReturnValue('EditItem'),
}));

const renderEditItemRoute = (initialEntry = '/inventory/edit/foo/bar/baz') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <EditItemRoute
      location={{ search: '', state: {}, pathname: '/inventory/edit/foo/bar/baz' }}
      stripes={{ okapi: { tenant: 'diku' } }}
    />
  </MemoryRouter>,
);

describe('EditItemRoute', () => {
  beforeEach(() => {
    mockAuthenticatedError.mockClear();
  });

  it('renders authenticated error for invalid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: 'foo',
      holdingId: 'bar',
      itemId: 'baz',
    });

    renderEditItemRoute();

    expect(screen.getByText('AuthenticatedError: /inventory/edit/foo/bar/baz')).toBeInTheDocument();
    expect(mockAuthenticatedError).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          pathname: '/inventory/edit/foo/bar/baz',
        }),
      }),
    );
  });

  it('renders item edit for valid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: '11111111-1111-4111-8111-111111111111',
      holdingId: '22222222-2222-4222-8222-222222222222',
      itemId: '33333333-3333-4333-8333-333333333333',
    });

    renderEditItemRoute('/inventory/edit/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/33333333-3333-4333-8333-333333333333');

    expect(screen.getByText('EditItem')).toBeInTheDocument();
    expect(mockAuthenticatedError).not.toHaveBeenCalled();
  });
});
