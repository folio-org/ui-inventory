import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useCentralOrderingSettingsQuery from './useCentralOrderingSettingsQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCentralOrderingSettingsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          settings: [{ value: 'true' }],
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch central ordering settings', async () => {
    const { result } = renderHook(() => useCentralOrderingSettingsQuery(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ settings: [{ value: 'true' }] });
  });
});
