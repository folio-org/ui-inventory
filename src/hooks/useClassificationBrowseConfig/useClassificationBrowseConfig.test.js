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

import useClassificationBrowseConfig from './useClassificationBrowseConfig';

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

describe('useClassificationBrowseConfig', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ configs: [{ id: 'all', typeIds: [] }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch classification browse config', async () => {
    const { result } = renderHook(() => useClassificationBrowseConfig(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.classificationBrowseConfig).toEqual([{ id: 'all', typeIds: [] }]);
  });
});
