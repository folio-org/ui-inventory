import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import useBoundPieces from './useBoundPieces';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);


describe('useBoundPieces', () => {
  beforeEach(() => {
    useOkapiKy.mockClear();
  });

  it('should return the data from the GET request', async () => {
    const mockData = [{ id: '1', itemId: 'itemId' }];
    const mockKy = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue(mockData),
    });
    useOkapiKy.mockReturnValue(mockKy);

    const { result } = renderHook(() => useBoundPieces('itemId'), { wrapper });

    await waitFor(async () => expect(result.current.isLoading).toBe(false));

    expect(mockKy).toHaveBeenCalledWith(`${ORDER_PIECES_API}?query=(itemId=="itemId")&limit=${LIMIT_MAX}&offset=0&sort=receivedDate`);
    expect(result.current.boundPieces).toEqual(mockData);
  });
});
