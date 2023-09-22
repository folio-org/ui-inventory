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
      />
    ) : (
      <HoldingsList
        {...rest}
        holdings={holdings}
        instance={instance}
        tenantId={tenantId}
      />
    )
  );
};

HoldingsListContainer.propTypes = {
  instance: PropTypes.object.isRequired,
  isHoldingsMove: PropTypes.bool,
};

export default HoldingsListContainer;
