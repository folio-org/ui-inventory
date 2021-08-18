import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import { LIMIT_MAX } from '../../../constants';

const useReceivingHistory = (holding, options = {}) => {
  const stripes = useStripes();

  const holdingReceivingHistory = holding.receivingHistory?.entries || [];

  const ky = useOkapiKy();

  const queryKey = ['ui-inventory', 'holding-pieces', holding.id];
  const queryFn = () => ky
    .get('orders/pieces', {
      searchParams: {
        limit: LIMIT_MAX,
        query: `holdingId==${holding.id} and displayOnHolding=="true"`,
      },
      enabled: stripes.hasInterface('pieces'),
    })
    .json()
    .then(({ pieces }) => pieces.map(piece => ({ ...piece, source: 'receiving' })));

  const { data: pieces = [], isFetching: isLoading } = useQuery({ queryKey, queryFn, ...options });

  return { isLoading, receivingHistory: [...holdingReceivingHistory, ...pieces] };
};

export default useReceivingHistory;
