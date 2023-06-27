import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';

import '../../../../test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import useDefaultJobProfile from './useDefaultJobProfile';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const jobProfileId = 'jobProfileId';

describe('useDefaultJobProfile', () => {
  it('should fetch default job profile', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          id: jobProfileId,
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useDefaultJobProfile(jobProfileId), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.defaultJobProfile.id).toBe(jobProfileId);
  });
});
