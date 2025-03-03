import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useMarcAuditDataQuery } from './useMarcAuditDataQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMarcAuditDataQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: jest.fn().mockResolvedValue({ marcAuditItems: [{ diff: [] }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch config', async () => {
    const { result } = renderHook(useMarcAuditDataQuery, { wrapper, initialProps: ['id'] });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([{ diff: [] }]);
  });
});
