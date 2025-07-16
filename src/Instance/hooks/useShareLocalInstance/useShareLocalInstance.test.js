import '../../../../test/jest/__mock__';

import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useShareLocalInstance from './useShareLocalInstance';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useShareLocalInstance', () => {
  it('should call post with correct path and body on success', async () => {
    const postMock = jest.fn().mockResolvedValue({});
    useOkapiKy.mockReturnValue({ post: postMock });

    const { result } = renderHook(() => useShareLocalInstance(), { wrapper });
    const consortiumId = 'consortium-123';
    const body = { instanceId: 'instance-456' };

    await act(async () => {
      await result.current.shareInstance({ consortiumId, body });
    });

    expect(postMock).toHaveBeenCalledWith(
      `consortia/${consortiumId}/sharing/instances`,
      { json: body }
    );
    expect(result.current.isSharing).toBe(false);
    expect(result.current.sharingError).toBeNull();
  });

  it('should handle error state when post rejects', async () => {
    const error = new Error('Network error');
    const postMock = jest.fn().mockRejectedValue(error);
    useOkapiKy.mockReturnValue({ post: postMock });

    const { result } = renderHook(() => useShareLocalInstance(), { wrapper });
    const consortiumId = 'consortium-123';
    const body = { instanceId: 'instance-456' };

    await act(async () => {
      try {
        await result.current.shareInstance({ consortiumId, body });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    expect(postMock).toHaveBeenCalledWith(
      `consortia/${consortiumId}/sharing/instances`,
      { json: body }
    );
    expect(result.current.isSharing).toBe(false);
    expect(result.current.sharingError).toBeInstanceOf(Error);
    expect(result.current.sharingError.message).toMatch(/Failed to share instance/);
  });
});
