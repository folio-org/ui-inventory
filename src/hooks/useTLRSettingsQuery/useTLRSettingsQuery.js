import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useTLRSettingsQuery = (tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'tlr-settings' });
  const searchParams = {
    query: '(name==TLR)',
  };

  return useQuery(
    [namespace, tenant],
    () => ky.get('circulation/settings', { searchParams }).json(),
  );
};

export default useTLRSettingsQuery;
