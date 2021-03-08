import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { keyBy } from 'lodash';

import { useOkapiKy } from '@folio/stripes/core';


const API = 'holdings-storage/holdings';
const LIMIT = 1000;


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


export const useInstanceHoldingsQuery = instanceId => {
  const ky = useOkapiKy();

  const holdings = useHoldings();

  const searchParams = {
    limit: LIMIT,
    query: `instanceId==${instanceId}`,
  };

  const queryKey = [API, searchParams];
  const queryFn = () => ky(API, { searchParams }).json();

  const onSuccess = data => holdings?.update(data.holdingsRecords);

  const { data, ...rest } = useQuery({ queryKey, queryFn, onSuccess });

  return { ...data, ...rest };
};
