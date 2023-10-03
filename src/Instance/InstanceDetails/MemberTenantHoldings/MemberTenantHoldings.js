import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { Accordion } from '@folio/stripes/components';

import { HoldingsList } from '../../HoldingsList';
import { MoveItemsContext } from '../../MoveItemsContext';
import { InstanceNewHolding } from '../InstanceNewHolding';

import { useInstanceHoldingsQuery } from '../../../providers';
import { hasMemberTenantPermission } from '../../../utils';

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
  const { holdingsRecords } = useInstanceHoldingsQuery(instance?.id, { tenantId: id });

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
      </div>
      <InstanceNewHolding
        instance={instance}
        disabled={!canCreateHoldings}
      />
    </Accordion>
  );
};

MemberTenantHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  memberTenant: PropTypes.object.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object),
};

export default MemberTenantHoldings;
