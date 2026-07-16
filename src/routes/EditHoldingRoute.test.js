import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import * as stripesUtil from '@folio/stripes/util';

import EditHoldingRoute from './EditHoldingRoute';

const mockAuthenticatedError = jest.fn(({ location }) => (
  <div>AuthenticatedError: {location.pathname}</div>
));

jest.mock('@folio/stripes/util', () => ({
  isValidUUID: jest.fn(() => false),
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

jest.mock('../Holding', () => ({
  EditHolding: jest.fn().mockReturnValue('EditHolding'),
}));

const renderEditHoldingRoute = (initialEntry = '/holdings/foo/bar') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <EditHoldingRoute
      location={{ search: '', state: {}, pathname: '/holdings/foo/bar' }}
      stripes={{ okapi: { tenant: 'diku' } }}
    />
  </MemoryRouter>,
);

describe('EditHoldingRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders authenticated error for invalid UUID params', () => {
    renderEditHoldingRoute();

    expect(screen.getByText('AuthenticatedError: /holdings/foo/bar')).toBeInTheDocument();
    expect(mockAuthenticatedError).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          pathname: '/holdings/foo/bar',
        }),
      }),
    );
  });

  it('renders holding edit for valid UUID params', () => {
    stripesUtil.isValidUUID.mockReturnValue(true);

    renderEditHoldingRoute('/holdings/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222');

    expect(screen.getByText('EditHolding')).toBeInTheDocument();
    expect(mockAuthenticatedError).not.toHaveBeenCalled();
  });
});
