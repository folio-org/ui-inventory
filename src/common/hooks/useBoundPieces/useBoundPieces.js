import { useQuery } from 'react-query';

import {
  getConsortiumCentralTenantId,
  LIMIT_MAX,
  ORDER_PIECES_API,
  useCentralOrderingSettings,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { extendKyWithTenant } from '../../../Instance/utils';
import { isUserInConsortiumMode } from '../../../utils';

const DEFAULT_DATA = [];
const SORTING_FIELD = 'receivedDate';

const useBoundPieces = (itemId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;

  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bound-pieces' });
  const filterQuery = `bindItemId==${itemId} and isBound==true`;

  const consortiumCentralTenantId = getConsortiumCentralTenantId(stripes);

  const {
    enabled: isCentralOrderingEnabled,
    isFetching: isCentralOrderingSettingsFetching,
  } = useCentralOrderingSettings({
    enabled: stripes.hasInterface('orders-storage.settings'),
  });

  const searchParams = {
    limit: LIMIT_MAX,
    query: `${filterQuery} sortby ${SORTING_FIELD}`,
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [namespace, itemId],
    queryFn: async ({ signal }) => {
      const makeRequest = (httpClient) => httpClient.get(ORDER_PIECES_API, { searchParams, signal }).json();

      if (isCentralOrderingEnabled) {
        const fulfilledResults = await Promise.allSettled([
          makeRequest(ky),
          makeRequest(extendKyWithTenant(ky, consortiumCentralTenantId))
        ]).then((results) => results.filter(({ status }) => status === 'fulfilled'));

        const totalRecords = fulfilledResults.reduce((acc, { value }) => acc + value.totalRecords, 0);
        const pieces = fulfilledResults
          .flatMap(({ value }, index) => value.pieces.map(piece => ({ ...piece, tenantId: index === 1 ? consortiumCentralTenantId : stripes.okapi.tenant })))
          .sort((a, b) => new Date(a[SORTING_FIELD]) - new Date(b[SORTING_FIELD]));

        return {
          pieces,
          totalRecords,
        };
      }

      return makeRequest(ky);
    },
    enabled: Boolean(
      enabled
      && itemId
      && !isCentralOrderingSettingsFetching
      && (isUserInConsortiumMode(stripes) ? consortiumCentralTenantId : true)
    ),
    ...otherOptions,
  });

  return ({
    isLoading,
    isFetching,
    refetch,
    boundPieces: data?.pieces || DEFAULT_DATA,
  });
};

export default useBoundPieces;
