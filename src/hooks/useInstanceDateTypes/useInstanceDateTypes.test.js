import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import { useInstanceDateTypes } from './useInstanceDateTypes';

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

describe('useInstanceDateTypes', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ instanceDateTypes: [{ id: 'date-type-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch items', async () => {
    const { result } = renderHook(() => useInstanceDateTypes(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.instanceDateTypes).toEqual([{ id: 'date-type-id' }]);
  });
});
