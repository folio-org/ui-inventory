import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useSharedInstancesQuery from './useSharedInstancesQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSharedInstancesQuery', () => {
  beforeEach(() => {
    useStripes.mockClear();

    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ sharingInstances: [{ id: 'id-1' }] }),
      }),
    });
  });

  it('should fetch shared instances', async () => {
    useStripes.mockReturnValue({
      user: {
        user: {
          consortium: {
            id: 'consortium-id',
          },
        },
      },
    });

    const { result } = renderHook(() => useSharedInstancesQuery({ searchParams: { instanceIdentifier: 'id-1' } }), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.sharedInstances).toEqual([{ id: 'id-1' }]);
  });
});
