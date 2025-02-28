import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useCallNumberBrowseConfig } from './useCallNumberBrowseConfig';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCallNumberBrowseConfig', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn().mockResolvedValue({ configs: [{ id: 'dewey' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch config', async () => {
    const { result } = renderHook(useCallNumberBrowseConfig, { wrapper });

    await act(() => !result.current.isCallNumberConfigLoading);

    expect(result.current.callNumberBrowseConfig).toEqual([{ id: 'dewey' }]);
  });
});
