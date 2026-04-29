import '../../test/jest/__mock__';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ItemRoute from './ItemRoute';

const mockedUseParams = jest.fn();
const mockedUseSearchInstanceByIdQuery = jest.fn();
const mockAuthenticatedError = jest.fn(({ location }) => (
  <div>AuthenticatedError: {location.pathname}</div>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

jest.mock('@folio/stripes/core', () => ({
  stripesConnect: (Component) => Component,
  AuthenticatedError: (props) => mockAuthenticatedError(props),
}));

jest.mock('../hocs', () => ({
  withLocation: (Component) => Component,
}));

jest.mock('../common', () => ({
  useSearchInstanceByIdQuery: (...args) => mockedUseSearchInstanceByIdQuery(...args),
}));

jest.mock('../providers', () => ({
  ItemModalsStateProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../contexts', () => ({
  DataContext: {
    Consumer: ({ children }) => children({}),
  },
}));

jest.mock('../Item', () => ({
  ViewItem: jest.fn().mockReturnValue('ViewItem'),
}));

const renderItemRoute = (initialEntry = '/inventory/view/foo/bar/baz') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <ItemRoute
      location={{ search: '', state: {}, pathname: '/inventory/view/foo/bar/baz' }}
      stripes={{ okapi: { tenant: 'diku' } }}
    />
  </MemoryRouter>,
);

describe('ItemRoute', () => {
  beforeEach(() => {
    mockAuthenticatedError.mockClear();
    mockedUseSearchInstanceByIdQuery.mockReturnValue({ instance: {} });
  });

  it('renders authenticated error for invalid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: 'foo',
      holdingsrecordid: 'bar',
      itemid: 'baz',
    });

    renderItemRoute();

    expect(screen.getByText('AuthenticatedError: /inventory/view/foo/bar/baz')).toBeInTheDocument();
    expect(mockAuthenticatedError).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          pathname: '/inventory/view/foo/bar/baz',
        }),
      }),
    );
    expect(mockedUseSearchInstanceByIdQuery).toHaveBeenCalledWith('foo', { enabled: false });
  });

  it('renders item view for valid UUID params', () => {
    mockedUseParams.mockReturnValue({
      id: '11111111-1111-4111-8111-111111111111',
      holdingsrecordid: '22222222-2222-4222-8222-222222222222',
      itemid: '33333333-3333-4333-8333-333333333333',
    });

    renderItemRoute('/inventory/view/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222/33333333-3333-4333-8333-333333333333');

    expect(screen.getByText('ViewItem')).toBeInTheDocument();
    expect(mockAuthenticatedError).not.toHaveBeenCalled();
    expect(mockedUseSearchInstanceByIdQuery).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111', { enabled: true });
  });
});
