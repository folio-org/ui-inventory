import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';

import useSearchInstanceByIdQuery from './useSearchInstanceByIdQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const instanceId = 'instanceId';

describe('useSearchInstanceByIdQuery', () => {
  it('should fetch instance', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          instances: [{
            id: instanceId,
          }]
        }),
      }),
    });

    const { result } = renderHook(() => useSearchInstanceByIdQuery(instanceId), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.instance.id).toBe(instanceId);
  });
});
