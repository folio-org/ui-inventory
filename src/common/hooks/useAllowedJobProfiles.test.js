import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import useAllowedJobProfiles from './useAllowedJobProfiles';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const allowedJobProfileIds = ['testId'];

describe('useAllowedJobProfiles', () => {
  it('should fetch default job profile', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          jobProfiles: allowedJobProfileIds,
        }),
      }),
    });

    const { result } = renderHook(() => useAllowedJobProfiles(allowedJobProfileIds), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.allowedJobProfiles).toBe(allowedJobProfileIds);
  });
});
