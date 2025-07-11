import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { CENTRAL_ORDERING_SETTINGS_KEY } from '@folio/stripes-acq-components';

const useCentralOrderingSettingsQuery = () => {
  const stripes = useStripes();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'central-ordering-settings' });


  return useQuery(
    [namespace],
    () => ky.get('orders-storage/settings', {
      searchParams: {
        query: `key=${CENTRAL_ORDERING_SETTINGS_KEY}`,
        limit: 1,
      },
    }).json(),
  );
};

export default useCentralOrderingSettingsQuery;
