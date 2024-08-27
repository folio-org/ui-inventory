import '../../../test/jest/__mock__';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import useInstanceMutation from './useInstanceMutation';
import { useTenantKy } from '../../common';

jest.mock('../../common', () => ({
  ...jest.requireActual('../../common'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceMutation', () => {
  it('should make post request when id is not provided', async () => {
    const postMock = jest.fn().mockReturnValue({ json: jest.fn() });

    useTenantKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useInstanceMutation({ tenantId: 'test' }),
      { wrapper },
    );

    await act(async () => { result.current.mutateInstance({ source: 'MARC' }); });

    expect(postMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    const putMock = jest.fn().mockReturnValue({ json: jest.fn() });

    useTenantKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => useInstanceMutation({ tenantId: 'test' }),
      { wrapper },
    );

    await act(async () => { result.current.mutateInstance({ id: 'instanceId' }); });

    expect(putMock).toHaveBeenCalled();
  });
});
