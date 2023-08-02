import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';
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

    const { result } = renderHook(() => useDefaultJobProfile(jobProfileId), { wrapper });

    await act(async () => !result.current.isLoading);

    expect(result.current.defaultJobProfile.id).toBe(jobProfileId);
  });
});
