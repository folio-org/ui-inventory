import '../../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useBoundWithsMutation from './useBoundWithsMutation';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBoundWithsMutation', () => {
  it('should make a put request', async () => {
    const putMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useBoundWithsMutation(),
      { wrapper },
    );

    await act(async () => { result.current.mutateBoundWiths(); });

    expect(putMock).toHaveBeenCalled();
  });
});
