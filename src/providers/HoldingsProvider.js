import keyBy from 'lodash/keyBy';
import {
  createContext,
  useContext,
  useState,
} from 'react';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../common';

const API = 'holdings-storage/holdings';
const LIMIT = 5000;
const DEFAULT_DATA = [];


const Context = createContext({});

export const useHoldings = () => useContext(Context);

export const HoldingsProvider = ({ ...rest }) => {
  const [holdingsById, setHoldingsById] = useState({});

  const update = records => setHoldingsById(store => ({ ...store, ...keyBy(records, 'id') }));

  const context = {
    update,
    holdingsById,
  };

  return <Context.Provider value={context} {...rest} />;
};


export const useInstanceHoldingsQuery = (instanceId, options = {}) => {
  const { tenantId, enabled = true, refreshKey, ...otherOptions } = options;
  const ky = useTenantKy({ tenantId });
  const holdings = useHoldings();

  const searchParams = {
    limit: LIMIT,
    query: `instanceId==${instanceId} sortBy effectiveLocation.name callNumberPrefix callNumber callNumberSuffix`,
  };

  const [namespace] = useNamespace({ key: 'fetch-holding-by-instance-id' });
  const queryKey = [namespace, instanceId, tenantId, refreshKey];
  const queryFn = () => ky(API, { searchParams }).json();

  const onSuccess = data => {
    return holdings?.update(data.holdingsRecords);
  };

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn,
    onSuccess,
    enabled: enabled && Boolean(instanceId),
    ...otherOptions,
  });

  return {
    ...data,
    ...rest,
    holdingsRecords: data?.holdingsRecords || DEFAULT_DATA,
  };
};
