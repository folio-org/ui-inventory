import { useQuery } from 'react-query';

import {
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const DEFAULT_DATA = [];

const useBoundPieces = (itemId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bound-pieces' });
  const filterQuery = `bindItemId==${itemId} and isBound==true`;

  const searchParams = {
    limit: LIMIT_MAX,
    query: `${filterQuery} sortby receivedDate`,
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [namespace, itemId],
    queryFn: () => ky.get(ORDER_PIECES_API, { searchParams }).json(),
    enabled: Boolean(enabled && itemId),
    ...otherOptions,
  });

  return ({
    isLoading,
    isFetching,
    refetch,
    boundPieces: data?.pieces || DEFAULT_DATA,
  });
};

export default useBoundPieces;
