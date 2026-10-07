import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import { instances } from '../../test/fixtures';
import useLoadSubInstances from './useLoadSubInstances';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLoadSubInstances', () => {
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

  it('returns an empty array when given an empty array of instance ids', () => {
    const { result } = renderHook(() => useLoadSubInstances(instances.map(({ id }) => id)), { wrapper });
    expect(result.current).toEqual([]);
  });
});
