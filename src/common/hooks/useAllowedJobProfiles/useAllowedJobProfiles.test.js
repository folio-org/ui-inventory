import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';

import '../../../../test/jest/__mock__';
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

    const { result, waitFor } = renderHook(() => useAllowedJobProfiles(allowedJobProfileIds), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.allowedJobProfiles.jobProfiles).toBe(allowedJobProfileIds);
  });
});
