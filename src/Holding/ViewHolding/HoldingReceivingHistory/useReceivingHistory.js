import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-inventory-components';

const useReceivingHistory = (holding, tenant, options = {}) => {
  const stripes = useStripes();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const holdingReceivingHistory = holding.receivingHistory?.entries || [];

  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'holding-receiving-history' });

  const queryKey = [namespace, holding.id, tenant];
  const queryFn = () => ky
    .get('orders/pieces', {
      searchParams: {
        limit: LIMIT_MAX,
        query: `holdingId==${holding.id} and displayOnHolding=="true" and receivingStatus="Received"`,
      },
      enabled: stripes.hasInterface('pieces'),
    })
    .json()
    .then(({ pieces }) => pieces.map(piece => ({ ...piece, source: 'receiving' })));

  const { data: pieces = [], isFetching } = useQuery({ queryKey, queryFn, ...options });

  const receivingHistory = tenant === centralTenantId ? pieces : [...holdingReceivingHistory, ...pieces];

  return { isFetching, receivingHistory };
};

export default useReceivingHistory;
