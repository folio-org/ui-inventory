import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQL_FIND_ALL,
  LIMIT_MAX,
} from '@folio/stripes-inventory-components';

const useClassificationIdentifierTypes = (tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'classification-identifier-types' });

  const query = useQuery({
    queryKey: [namespace, 'classification-types'],
    queryFn: () => ky.get(`classification-types?limit=${LIMIT_MAX}&query=${CQL_FIND_ALL} sortby name`).json(),
  });

  return ({
    ...query,
    classificationTypes: query.data?.classificationTypes || [],
  });
};

export default useClassificationIdentifierTypes;
