import React from 'react';
import PropTypes from 'prop-types';

import {
  Loading,
} from '@folio/stripes/components';

import HoldingsList from './HoldingsList';
import { HoldingsListMovement } from '../InstanceMovement/HoldingMovementList';
import { useInstanceHoldingsQuery } from '../../providers';

const HoldingsListContainer = ({
  instance,
  isHoldingsMove,
  tenantId,
  pathToAccordionsState,
  ...rest
}) => {
  const { holdingsRecords: holdings, isLoading } = useInstanceHoldingsQuery(instance.id, { tenantId });

  if (isLoading) return <Loading size="large" />;

  return (
    isHoldingsMove ? (
      <HoldingsListMovement
        {...rest}
        holdings={holdings}
        instance={instance}
        tenantId={tenantId}
        pathToAccordionsState={pathToAccordionsState}
      />
    ) : (
      <HoldingsList
        {...rest}
        holdings={holdings}
        instance={instance}
        tenantId={tenantId}
        pathToAccordionsState={pathToAccordionsState}
      />
    )
  );
};

HoldingsListContainer.propTypes = {
  instance: PropTypes.object.isRequired,
  isHoldingsMove: PropTypes.bool,
  tenantId: PropTypes.string,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

export default HoldingsListContainer;
