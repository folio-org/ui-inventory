import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  CQL_FIND_ALL,
  LIMIT_MAX,
} from '@folio/stripes-inventory-components';

const useCallNumberBrowseConfig = () => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'call-number-browse-config' });
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;
  const ky = useOkapiKy({ tenant: centralTenantId });

  const { data, isFetching } = useQuery(
    [namespace],
    () => ky.get('browse/config/instance-call-number', {
      searchParams: {
        limit: LIMIT_MAX,
        query: CQL_FIND_ALL,
      },
    }).json(),
  );

  return {
    callNumberBrowseConfig: data?.configs || [],
    isCallNumberConfigLoading: isFetching,
  };
};

export { useCallNumberBrowseConfig };
