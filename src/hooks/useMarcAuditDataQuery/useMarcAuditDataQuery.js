import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const useMarcAuditDataQuery = (id, eventTs) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'marc-audit-data' });

  // eventTs param is used to load more data
  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, id, eventTs],
    queryFn: () => ky.get(`audit-data/marc/bib/${id}`, {
      searchParams: {
        ...(eventTs && { eventTs })
      }
    }).json(),
    enabled: Boolean(id),
  });

  return {
    data: data?.marcAuditItems || [],
    totalRecords: data?.totalRecords,
    isLoading,
  };
};
