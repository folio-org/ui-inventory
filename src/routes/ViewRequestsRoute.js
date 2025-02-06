import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import {
  batchFetch,
  batchFetchRequests,
  buildQueryByItemsIds,
  useFetchItems,
  ViewRequests,
} from '../Instance/ViewRequests';

const ViewRequestsRoute = ({ mutator, resources }) => {
  const { id: instanceId } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const { allInstanceHoldings, selectedInstance } = resources;
  const instanceHoldings = allInstanceHoldings.records;
  const items = useFetchItems(mutator.allInstanceItems, instanceHoldings);
  const [requestsMap, setRequestsMap] = useState();
  const [loansMap, setLoansMap] = useState();

  useEffect(() => {
    if (items?.length) {
      const requestsMapInitial = new Map(items.map(obj => [obj.id, 0]));
      const loansMapInitial = new Map(items.map(obj => [obj.id, []]));
      batchFetchRequests(mutator.allInstanceRequests, items)
        .then(
          (responseRequests) => setRequestsMap(responseRequests.reduce((acc, r) => {
            acc.set(r.itemId, acc.get(r.itemId) + 1);
            return acc;
          }, requestsMapInitial)),
          () => setRequestsMap(new Map()),
        );

      batchFetch(mutator.allInstanceOpenLoans, items, buildQueryByItemsIds, undefined, ' AND status.name=="Open" ')
        .then((responseLoans) => setLoansMap(responseLoans.reduce((acc, l) => {
          acc.get(l.itemId).push(l);
          return acc;
        }, loansMapInitial)))
        .catch(() => setLoansMap(new Map()));
    }
  }, [items]);

  const onCloseViewRequests = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instanceId}`,
      search,
    });
  }, [history, instanceId, search]);

  return (
    <ViewRequests
      instance={selectedInstance.records[0]}
      instanceId={instanceId}
      items={items}
      loansMap={loansMap}
      onCloseViewRequests={onCloseViewRequests}
      requestsMap={requestsMap}
    />
  );
};

ViewRequestsRoute.manifest = {
  selectedInstance: {
    type: 'okapi',
    path: 'inventory/instances/:{id}',
    clear: false,
    throwErrors: false,
  },
  allInstanceOpenLoans: {
    type: 'okapi',
    path: 'circulation/loans',
    throwErrors: false,
    records: 'loans',
    accumulate: true,
    fetch: false,
  },
  allInstanceRequests: {
    type: 'okapi',
    path: 'circulation/requests',
    records: 'requests',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
  allInstanceItems: {
    accumulate: true,
    fetch: false,
    path: 'inventory/items',
    records: 'items',
    throwErrors: false,
    type: 'okapi',
  },
  allInstanceHoldings: {
    type: 'okapi',
    records: 'holdingsRecords',
    path: 'holdings-storage/holdings',
    fetch: true,
    throwErrors: false,
    params: {
      query: 'instanceId==:{id} sortBy effectiveLocation.name callNumberPrefix callNumber callNumberSuffix',
      limit: '1000',
    },
  },
};

ViewRequestsRoute.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(ViewRequestsRoute);
