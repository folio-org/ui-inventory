import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useConsortiumTenants from './useConsortiumTenants';


jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['test']),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const consortium = {
  id: 'consortium-id',
  centralTenantId: 'mobius',
};

const response = {
  tenants: [],
  totalRecords: 0,
};

describe('useConsortiumTenants', () => {
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
        user: { consortium },
      }
    });
  });

  it('should fetch consortium tenants', async () => {
    const { result } = renderHook(() => useConsortiumTenants(), { wrapper });

    expect(mockGet).toHaveBeenCalledWith(`consortia/${consortium.id}/tenants`);
    expect(result.current.tenants).toEqual([]);
  });
});
