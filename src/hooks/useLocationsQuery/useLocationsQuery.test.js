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
import useLocationsQuery from './useLocationsQuery';

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

describe('useLocationsQuery', () => {
  beforeEach(() => {
    useTenantKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ locations: [{ id: 'location-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch locations', async () => {
    const { result } = renderHook(() => useLocationsQuery(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([{ id: 'location-id' }]);
  });
});
