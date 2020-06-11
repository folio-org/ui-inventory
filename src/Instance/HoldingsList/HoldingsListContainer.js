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

const HoldingsListContainer = ({ mutator, referenceDeata, instance, ...rest }) => {
  const [holdings, setHoldings] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    mutator.instanceHoldings.GET()
      .then(setHoldings)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Loading size="large" />;

  return (
    <HoldingsList
      {...rest}
      holdings={holdings}
      instance={instance}
      referenceDeata={referenceDeata}
    />
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
  referenceDeata: PropTypes.object.isRequired,
};

export default stripesConnect(HoldingsListContainer);
