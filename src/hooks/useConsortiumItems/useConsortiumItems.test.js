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

import useConsortiumItems from './useConsortiumItems';
import { useTenantKy } from '../../common';

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

describe('useConsortiumItems', () => {
  beforeEach(() => {
    useTenantKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ items: [{ id: 'items-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch items', async () => {
    const { result } = renderHook(() => useConsortiumItems('instanceId', 'holdingsId', 'college'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.items).toEqual([{ id: 'items-id' }]);
  });
});
