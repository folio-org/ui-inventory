import '../../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useInstanceQuery from './useInstanceQuery';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const instanceId = 'instanceId';

describe('useInstanceQuery', () => {
  it('should fetch instance', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: instanceId,
        }),
      }),
    });

    const { result } = renderHook(() => useInstanceQuery(instanceId), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.instance.id).toBe(instanceId);
  });
});
