import React from 'react';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

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
  const stripes = useStripes();
  const { holdingsRecords: holdings, isLoading } = useInstanceHoldingsQuery(instance.id, { tenantId });

  const canViewHoldings = stripes.hasPerm('ui-inventory.instance.view');
  const canCreateItem = stripes.hasPerm('ui-inventory.item.edit');
  const canViewItems = stripes.hasPerm('ui-inventory.instance.view');

  if (isLoading) return <Loading size="large" />;

  return (
    isHoldingsMove ? (
      <HoldingsListMovement
        {...rest}
        holdings={holdings}
        instance={instance}
        tenantId={tenantId}
        isViewHoldingsDisabled={!canViewHoldings}
        isAddItemDisabled={!canCreateItem}
        isBarcodeAsHotlink={canViewItems}
        pathToAccordionsState={pathToAccordionsState}
      />
    ) : (
      <HoldingsList
        {...rest}
        holdings={holdings}
        instance={instance}
        tenantId={tenantId}
        isViewHoldingsDisabled={!canViewHoldings}
        isAddItemDisabled={!canCreateItem}
        isBarcodeAsHotlink={canViewItems}
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

HoldingsListContainer.defaultProps = { pathToAccordionsState: [] };

export default HoldingsListContainer;
