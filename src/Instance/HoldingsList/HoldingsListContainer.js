import React from 'react';
import PropTypes from 'prop-types';

import {
  Loading,
} from '@folio/stripes/components';

import HoldingsList from './HoldingsList';
import { HoldingsListMovement } from '../InstanceMovement/HoldingMovementList';
import { useInstanceHoldingsQuery } from '../../providers';
import { hasMemberTenantPermission } from '../../utils';

const HoldingsListContainer = ({
  instance,
  isHoldingsMove,
  tenantId,
  userTenantPermissions,
  ...rest
}) => {
  const { holdingsRecords: holdings, isLoading } = useInstanceHoldingsQuery(instance.id, { tenantId });

  const canViewHoldings = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.holdings.edit', tenantId);
  const canCreateItem = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.item.create', tenantId);
  const canViewItems = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.item.create', tenantId);

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
      />
    )
  );
};

HoldingsListContainer.propTypes = {
  instance: PropTypes.object.isRequired,
  isHoldingsMove: PropTypes.bool,
  tenantId: PropTypes.string,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
};

export default HoldingsListContainer;
