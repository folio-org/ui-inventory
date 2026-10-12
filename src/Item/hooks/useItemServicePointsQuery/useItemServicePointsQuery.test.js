import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useItemServicePointsQuery from './useItemServicePointsQuery';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemServicePointsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ servicepoints: [{ id: 'service-point-id' }] }),
      }),
    });
  });

  it('should fetch service points', async () => {
    const { result } = renderHook(() => useItemServicePointsQuery('service-point-id'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.servicePoints).toEqual([{ id: 'service-point-id' }]);
  });
});
