import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TAGS_KEY, TAGS_SCOPE } from '../../constants';
import { MOD_SETTINGS_API } from '../../settings/NumberGeneratorSettings/constants';

const useTagSettingsQuery = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'tag-settings' });

  const { isLoading, data: tagSettings = {}, isFetching } = useQuery(
    [namespace],
    () => ky.get(`${MOD_SETTINGS_API}?query=(scope==${TAGS_SCOPE} and key==${TAGS_KEY})`).json(),
  );

  return ({
    isLoading,
    isFetching,
    tagSettings,
  });
};

export default useTagSettingsQuery;
