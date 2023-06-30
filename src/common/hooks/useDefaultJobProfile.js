import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { DATA_IMPORT_JOB_PROFILES_ROUTE } from '../../constants';

const useDefaultJobProfile = (jobProfileId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'defaultJobProfileId' });

  const path = `${DATA_IMPORT_JOB_PROFILES_ROUTE}/${jobProfileId}`;

  const { isLoading, data: defaultJobProfile = {} } = useQuery(
    [namespace, jobProfileId],
    () => ky.get(path).json(),
    { enabled: Boolean(jobProfileId) },
  );

  return ({
    isLoading,
    defaultJobProfile,
  });
};

export default useDefaultJobProfile;
