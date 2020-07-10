import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Loading,
} from '@folio/stripes/components';

import HoldingsList from './HoldingsList';
import HoldingsListMovement from '../HoldingMovementList';

const HoldingsListContainer = ({
  mutator,
  referenceData,
  instance,
  isHoldingsMove,
  ...rest
}) => {
  const [holdings, setHoldings] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchHoldingPromise = mutator.instanceHoldings.GET() || Promise.reject();

    fetchHoldingPromise
      .then(setHoldings)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loading size="large" />;

  return (
    isHoldingsMove ? (
      <HoldingsListMovement
        {...rest}
        holdings={holdings}
        instance={instance}
        referenceData={referenceData}
      />
    ) : (
      <HoldingsList
        {...rest}
        holdings={holdings}
        instance={instance}
        referenceData={referenceData}
      />
    )
  );
};

HoldingsListContainer.manifest = Object.freeze({
  instanceHoldings: {
    type: 'okapi',
    records: 'holdingsRecords',
    path: 'holdings-storage/holdings',
    params: {
      query: 'instanceId==!{instance.id}',
      limit: '1000',
    },
    accumulate: true,
  },
});

HoldingsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  instance: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  isHoldingsMove: PropTypes.bool,
};

export default stripesConnect(HoldingsListContainer);
