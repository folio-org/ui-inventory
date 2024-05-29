import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { CQL_FIND_ALL } from '@folio/stripes-inventory-components';

import { LIMIT_MAX } from '../../constants';

const useClassificationBrowseConfig = () => {
  const stripes = useStripes();
  const centralTenantId = stripes.user.user?.consortium?.centralTenantId;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'classification-browse-config' });

  const query = useQuery({
    queryKey: [namespace, 'classification-browse-config'],
    queryFn: () => ky.get(`browse/config/instance-classification?limit=${LIMIT_MAX}&query=${CQL_FIND_ALL}`).json(),
  });

  return ({
    ...query,
    classificationBrowseConfig: query.data?.configs || [],
  });
};

export default useClassificationBrowseConfig;
