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

import useClassificationIdentifierTypes from './useClassificationIdentifierTypes';

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

describe('useClassificationIdentifierTypes', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ classificationTypes: [{ id: 'classification-type-id' }] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch classification identifier types', async () => {
    const { result } = renderHook(() => useClassificationIdentifierTypes(), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.classificationTypes).toEqual([{ id: 'classification-type-id' }]);
  });
});
