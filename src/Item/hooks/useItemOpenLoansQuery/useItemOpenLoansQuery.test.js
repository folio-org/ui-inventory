import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useItemOpenLoansQuery from './useItemOpenLoansQuery';

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

describe('useItemOpenLoansQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ loans: [{ id: 'loan-id' }] }),
      }),
    });
  });

  it('should fetch open loans', async () => {
    const { result } = renderHook(() => useItemOpenLoansQuery('itemId'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.openLoans).toEqual({ loans: [{ id: 'loan-id' }] });
  });
});
