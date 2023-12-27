import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../../constants';

const DEFAULT_DATA = [];

const useConsortiumTenants = () => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'consortium-tenants' });

  const consortium = stripes?.user?.user?.consortium;

  const enabled = Boolean(consortium?.centralTenantId && consortium?.id);

  const {
    isFetching,
    isLoading,
    data = {},
  } = useQuery(
    [namespace, consortium?.id],
    async () => {
      const api = ky.extend({
        hooks: {
          beforeRequest: [
            request => {
              request.headers.set(OKAPI_TENANT_HEADER, consortium.centralTenantId);
            },
          ],
        },
      });

      return api.get(
        `consortia/${consortium.id}/tenants`,
      ).json();
    },
    { enabled },
  );

  return ({
    tenants: data.tenants || DEFAULT_DATA,
    totalRecords: data.totalRecords,
    isFetching,
    isLoading,
  });
};

export default useConsortiumTenants;
