import { act } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../test/jest/__mock__';

import { useOkapiKy } from '@folio/stripes/core';

import useUpdateOwnership from './useUpdateOwnership';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUpdateOwnership', () => {
  it('should make post request to the correct endpoint', async () => {
    const postMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useUpdateOwnership(),
      { wrapper },
    );

    const body = { someData: 'value' };

    await act(async () => {
      await result.current.updateOwnership(body);
    });

    expect(postMock).toHaveBeenCalledWith('inventory/holdings/update-ownership', { json: body });
    expect(postMock).toHaveBeenCalledTimes(1);
  });
});
