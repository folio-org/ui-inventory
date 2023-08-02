import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  MAX_RECORDS,
} from '../../constants';
import useConsortiumPermissions from './useConsortiumPermissions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['test']),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const consortia = [{
  'id': '2b51c2f5-6779-4913-9cc8-05508ea406a4',
  'name': 'folio'
}];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const user = { id: 'userId' };
const consortium = {
  ...consortia[0],
  centralTenantId: 'mobius',
};

const response = {
  id: 'userPermissionId',
  permissions: [
    { subPermissions: ['users.view'] },
    { subPermissions: ['consortia.view'] },
  ],
};

describe('useConsortiumPermissions', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(response),
  }));
  const setHeaderMock = jest.fn();
  const kyMock = {
    extend: jest.fn(({ hooks: { beforeRequest } }) => {
      beforeRequest.forEach(handler => handler({ headers: { set: setHeaderMock } }));

      return {
        get: mockGet,
      };
    }),
  };

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useStripes.mockClear().mockReturnValue({
      user: {
        user: { ...user, consortium },
      }
    });
  });

  it('should fetch consortium permissions', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumPermissions(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(
      `perms/users/${user.id}`,
      expect.objectContaining({ searchParams: { indexField: 'userId' } }),
    );
    expect(mockGet).toHaveBeenCalledWith(
      'perms/permissions',
      expect.objectContaining({
        searchParams: {
          limit: MAX_RECORDS,
          query: `(grantedTo=${response.id})`,
          expanded: true,
        },
      }),
    );
  });

  it('should return consortia permissions', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumPermissions(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.permissions).toEqual({ 'consortia.view': true });
  });
});
