import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useCallNumberTypesQuery } from './useCallNumberTypesQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCallNumberTypesQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          callNumberTypes: [{ id: 'call-number-type-id' }],
        }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch call number types', async () => {
    const { result } = renderHook(() => useCallNumberTypesQuery(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.callNumberTypes).toEqual([{ id: 'call-number-type-id' }]);
  });
});
