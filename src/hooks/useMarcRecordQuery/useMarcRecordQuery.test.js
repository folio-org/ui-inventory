import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useMarcRecordQuery from './useMarcRecordQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useMarcRecordQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          marcRecord: [{ id: 'marcRecordId' }],
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch marc record', async () => {
    const { result } = renderHook(() => useMarcRecordQuery('instance-id', 'INSTANCE'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual({ marcRecord: [{ id: 'marcRecordId' }] });
  });
});
