import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useInstanceImportSupportedQuery from './useInstanceImportSupportedQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceImportSupportedQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve(true),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch is import supported', async () => {
    const { result } = renderHook(() => useInstanceImportSupportedQuery('instance-id'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual(true);
  });
});
