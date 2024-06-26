import { useQuery } from 'react-query';
import { isEmpty } from 'lodash';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-inventory-components';

import {
  DATA_IMPORT_JOB_PROFILES_ROUTE,
} from '../../constants';

const useAllowedJobProfiles = (allowedJobProfileIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'allowedJobProfiles' });

  const DATA_TYPE_MARC_QUERY = 'dataType==("MARC")';

  const ids = allowedJobProfileIds.join(' or ');
  const allowedIdsQuery = `id==(${ids})`;
  const path = `${DATA_IMPORT_JOB_PROFILES_ROUTE}?limit=${LIMIT_MAX}&query=${DATA_TYPE_MARC_QUERY} and ${allowedIdsQuery} sortBy name`;

  const { isLoading, data: allowedJobProfiles = {} } = useQuery({
    queryKey: [namespace, allowedJobProfileIds],
    queryFn: () => ky.get(path).json(),
    enabled: !isEmpty(allowedJobProfileIds),
  });

  return ({
    isLoading,
    allowedJobProfiles: allowedJobProfiles.jobProfiles,
  });
};

export default useAllowedJobProfiles;
