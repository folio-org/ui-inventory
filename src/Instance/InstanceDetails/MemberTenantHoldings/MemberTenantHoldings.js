import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  Accordion,
  Loading,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import { HoldingsList } from '../../HoldingsList';
import { InstanceNewHolding } from '../InstanceNewHolding';
import { MoveItemsContext } from '../../MoveItemsContext';

import { useInstanceHoldingsQuery } from '../../../providers';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
  userTenantPermissions,
}) => {
  const {
    name,
    id,
  } = memberTenant;
  const stripes = useStripes();
  const { holdingsRecords, isLoading } = useInstanceHoldingsQuery(instance?.id, { tenantId: id });
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const canViewHoldings = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.holdings.edit', id);
  const canCreateItem = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.item.create', id);
  const canCreateHoldings = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.holdings.create', id);
  const canViewItems = hasMemberTenantPermission(userTenantPermissions, 'ui-inventory.item.create', id);

  if (isEmpty(holdingsRecords)) return null;

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={`${name}-holdings`}
      label={name}
      closedByDefault
    >
      <div className={css.memberTenantHoldings}>
        {isLoading
          ? <Loading size="large" />
          : (
            <MoveItemsContext>
              <HoldingsList
                holdings={holdingsRecords}
                instance={instance}
                tenantId={id}
                draggable={false}
                droppable={false}
                isViewHoldingsDisabled={!canViewHoldings}
                isAddItemDisabled={!canCreateItem}
                isBarcodeAsHotlink={canViewItems}
              />
            </MoveItemsContext>
          )}
      </div>
      {!isUserInCentralTenant && (
         <InstanceNewHolding
          instance={instance}
          tenantId={id}
          disabled={!canCreateHoldings}
        />
      )}
    </Accordion>
  );
};

MemberTenantHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  memberTenant: PropTypes.object.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
};

export default MemberTenantHoldings;
