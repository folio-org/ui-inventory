import { orderBy } from 'lodash';
import { useQuery } from 'react-query';

import { useStripes } from '@folio/stripes/core';

import {
  OKAPI_TENANT_HEADER,
  CONTENT_TYPE_HEADER,
  OKAPI_TOKEN_HEADER,
} from '../../constants';

const fetchConsortiumUserTenants = ({ okapi }, tenant, { id: consortiumId }) => {
  return fetch(`${okapi.url}/consortia/${consortiumId}/_self`, {
    credentials: 'include',
    headers: {
      [OKAPI_TENANT_HEADER]: tenant,
      [CONTENT_TYPE_HEADER]: 'application/json',
      ...(okapi.token && { [OKAPI_TOKEN_HEADER]: okapi.token }),
    },
  })
    .then(resp => resp.json())
    .then(data => orderBy(data.userTenants || [], 'tenantName'));
};

const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;

  const enabled = Boolean(
    consortium?.centralTenantId
    && userId,
  );

  const {
    isFetching,
    isLoading: isAffiliationsLoading,
    data: userTenants = [],
    refetch,
  } = useQuery({
    queryKey: ['consortium', 'self', userId, options.tenant],
    queryFn: () => {
      return fetchConsortiumUserTenants(stripes, consortium?.centralTenantId, { id: consortium.id });
    },
    enabled,
    ...options,
  });

  return ({
    affiliations: userTenants,
    totalRecords: userTenants.length,
    isFetching,
    isLoading: isAffiliationsLoading,
    refetch,
  });
};

export default useUserAffiliations;
