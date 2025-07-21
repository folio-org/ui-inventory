import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useTLRSettingsQuery = (tenant) => {
  const ky = useOkapiKy({ tenant });
  const [namespace] = useNamespace({ key: 'tlr-settings' });

  return useQuery(
    [namespace, tenant],
    () => ky.get('configurations/entries?query=(module==SETTINGS and configName==TLR)').json(),
  );
};

export default useTLRSettingsQuery;
