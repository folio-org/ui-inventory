import React, { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import useHoldingAuditDataQuery from './useHoldingAuditDataQuery';

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

describe('useHoldingAuditDataQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ inventoryAuditItems: [{ action: 'UPDATE' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch holdings', async () => {
    const { result } = renderHook(() => useHoldingAuditDataQuery('holdingId'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.data).toEqual([{ action: 'UPDATE' }]);
  });
});
