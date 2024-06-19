import { useMutation } from 'react-query';

import { ORDER_PIECES_API } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

const usePiecesMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (piece) => ky.put(`${ORDER_PIECES_API}/${piece.id}`, { json: piece }),
    ...options,
  });

  return {
    isLoading,
    updatePiece: mutateAsync,
  };
};

export default usePiecesMutation;
