import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useTenantKy } from '../../common';
import useSearchForShadowInstanceTenants from './useSearchForShadowInstanceTenants';

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSearchForShadowInstanceTenants', () => {
  beforeEach(() => {
    useTenantKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          facets: {
            'holdings.tenantId': {
              values: [{ id: 'tenantId' }],
            },
          },
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tenants', async () => {
    const { result } = renderHook(() => useSearchForShadowInstanceTenants(
      { instanceId: 'instanceId' }
    ), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.tenants).toEqual([{ id: 'tenantId' }]);
  });
});
