import omit from 'lodash/omit';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

import { extendKyWithTenant } from '../../../Instance/utils';
import usePiecesMutation from './usePiecesMutation';

jest.mock('../../../Instance/utils', () => ({
  extendKyWithTenant: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePiecesMutation', () => {
  const mockKy = {
    put: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOkapiKy.mockReturnValue(mockKy);
  });

  it('should call ky.put when updatePiece is triggered', async () => {
    const pieceData = { id: 'piece1', title: 'Test Piece', tenantId: null };
    mockKy.put.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => usePiecesMutation(), { wrapper });

    result.current.updatePiece(pieceData);

    await waitFor(() => expect(mockKy.put).toHaveBeenCalledWith(`${ORDER_PIECES_API}/piece1`, { json: omit(pieceData, 'tenantId') }));
  });

  it('should handle tenantId and use extendKyWithTenant if tenantId is provided', async () => {
    const pieceData = { id: 'piece1', title: 'Test Piece', tenantId: 'central-tenant' };
    const extendedKy = { put: jest.fn().mockResolvedValueOnce({ status: 200 }) };

    extendKyWithTenant.mockReturnValue(extendedKy);

    const { result } = renderHook(() => usePiecesMutation(), { wrapper });

    result.current.updatePiece(pieceData);

    await waitFor(() => expect(extendKyWithTenant).toHaveBeenCalledWith(mockKy, 'central-tenant'));
    await waitFor(() => expect(extendedKy.put).toHaveBeenCalledWith(`${ORDER_PIECES_API}/piece1`, { json: omit(pieceData, 'tenantId') }));
  });
});
