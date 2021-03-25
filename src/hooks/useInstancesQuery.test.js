import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { instances } from '../../test/fixtures';
import useInstancesQuery from './useInstancesQuery';


const instance = instances[0];
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
        json: () => instance,
      }),
    });
  });

  afterEach(() => {
    mock.mockRestore();
  });

  it('fetches instances', async () => {
    const { result, waitFor } = renderHook(() => useInstancesQuery([instance.id]), { wrapper });
    await waitFor(() => result.current[0].isSuccess);
    expect(result.current[0].data.id).toEqual(instance.id);
  });
});
