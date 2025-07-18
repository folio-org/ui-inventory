import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useTLRSettingsQuery from './useTLRSettingsQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTLRSettingsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          config: [{ value: { titleLevelRequestsFeatureEnabled: 'true' } }],
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch config', async () => {
    const { result } = renderHook(() => useTLRSettingsQuery(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ config: [{ value: { titleLevelRequestsFeatureEnabled: 'true' } }] });
  });
});
