import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { keyBy } from 'lodash';

import { useTenantKy } from '../common';

const API = 'holdings-storage/holdings';
const LIMIT = 5000;


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


export const useInstanceHoldingsQuery = (instanceId, { tenantId, enabled } = {}) => {
  const ky = useTenantKy({ tenantId });

  const holdings = useHoldings();

  const searchParams = {
    limit: LIMIT,
    query: `instanceId==${instanceId}`,
  };

  const queryKey = [API, searchParams, tenantId];
  const queryFn = () => ky(API, { searchParams }).json();

  const onSuccess = data => holdings?.update(data.holdingsRecords);

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn,
    onSuccess,
    enabled,
  });

  return { ...data, ...rest };
};
