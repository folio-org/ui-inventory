import '../../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import useItemMutation from './useItemMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useItemMutation', () => {
  it('should make post request when id is not provided', async () => {
    const postMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useItemMutation(),
      { wrapper },
    );

    await result.current.mutateItem({ barcode: 'barcode' });

    expect(postMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    const putMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useItemMutation(),
      { wrapper },
    );

    await result.current.mutateItem({
      id: 'itemId',
    });

    expect(putMock).toHaveBeenCalled();
  });
});
