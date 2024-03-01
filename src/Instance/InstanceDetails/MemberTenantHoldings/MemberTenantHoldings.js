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
import { hasMemberTenantPermission } from '../../../utils';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
  userTenantPermissions,
}) => {
  const {
    name,
    id: memberTenantId,
  } = memberTenant;
  const stripes = useStripes();

  const pathToHoldingsAccordion = ['consortialHoldings', memberTenantId];

  const { holdingsRecords, isLoading } = useInstanceHoldingsQuery(instance?.id, { tenantId: memberTenantId });
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const canViewHoldingsAndItems = hasMemberTenantPermission('ui-inventory.instance.view', memberTenantId, userTenantPermissions);
  const canCreateItem = hasMemberTenantPermission('ui-inventory.item.create', memberTenantId, userTenantPermissions);
  const canCreateHoldings = hasMemberTenantPermission('ui-inventory.holdings.create', memberTenantId, userTenantPermissions);

  if (isEmpty(holdingsRecords)) return null;

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={memberTenantId}
      label={name}
    >
      <div className={css.memberTenantHoldings}>
        {isLoading
          ? <Loading size="large" />
          : (
            <MoveItemsContext>
              <HoldingsList
                holdings={holdingsRecords}
                instance={instance}
                tenantId={memberTenantId}
                draggable={false}
                droppable={false}
                showViewHoldingsButton={canViewHoldingsAndItems}
                showAddItemButton={canCreateItem}
                isBarcodeAsHotlink={canViewHoldingsAndItems}
                pathToAccordionsState={pathToHoldingsAccordion}
              />
            </MoveItemsContext>
          )}
      </div>
      {!isUserInCentralTenant && canCreateHoldings && (
        <InstanceNewHolding
          instance={instance}
          tenantId={memberTenantId}
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
