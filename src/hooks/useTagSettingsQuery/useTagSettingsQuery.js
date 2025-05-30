import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useTagSettingsQuery = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'tag-settings' });

  const { isLoading, data: tagSettings = {}, isFetching } = useQuery(
    [namespace],
    () => ky.get('configurations/entries?query=(module==TAGS and configName==tags_enabled)').json(),
  );

  return ({
    isLoading,
    isFetching,
    tagSettings,
  });
};

export default useTagSettingsQuery;
