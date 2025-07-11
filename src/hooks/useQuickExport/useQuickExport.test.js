import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useQuickExport from './useQuickExport';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useQuickExport', () => {
  it('should make a post request', async () => {
    const postMock = jest.fn().mockResolvedValue({});

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(() => useQuickExport(), { wrapper });

    result.current.mutateAsync({ uuids: [] });

    waitFor(() => expect(postMock).toHaveBeenCalled());
  });
});
