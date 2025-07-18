import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useMarcRecordQuery = (entityId, idType, tenant, { enabled = true } = {}) => {
  const [namespace] = useNamespace({ key: 'marc-record' });
  const ky = useOkapiKy({ tenant });

  return useQuery(
    [namespace, entityId, idType, tenant],
    () => ky.get(`source-storage/records/${entityId}/formatted?idType=${idType}`).json(),
    {
      enabled: Boolean(enabled && idType && entityId),
    },
  );
};

export default useMarcRecordQuery;
