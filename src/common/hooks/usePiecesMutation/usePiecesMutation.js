import { useMutation } from 'react-query';

import { ORDER_PIECES_API } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { extendKyWithTenant } from '../../../Instance/utils';

const usePiecesMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (piece) => {
      const httpClient = piece?.tenantId ? extendKyWithTenant(ky, piece.tenantId) : ky;

      return httpClient.put(`${ORDER_PIECES_API}/${piece.id}`, { json: piece });
    },
    ...options,
  });

  return {
    isLoading,
    updatePiece: mutateAsync,
  };
};

export default usePiecesMutation;
