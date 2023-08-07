import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { instances } from '../../test/fixtures';
import useInstancesQuery from './useInstancesQuery';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstancesQuery', () => {
  let mock;
  beforeEach(() => {
    mock = useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ instances }),
      }),
    });
  });

  afterEach(() => {
    mock.mockRestore();
  });

  it('fetches instances', async () => {
    const { result } = renderHook(() => useInstancesQuery(instances.map(({ id }) => id)), { wrapper });

    await act(() => result.isSuccess);
    expect(result.current.data.instances[0].id).toEqual(instances[0].id);
  });
});
