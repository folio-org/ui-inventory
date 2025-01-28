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

import HoldingsList from '../../HoldingsList';
import { LimitedHoldingsList } from '../LimitedHoldingsList';
import { InstanceNewHolding } from '../../../InstanceDetails/InstanceNewHolding';
import { MoveItemsContext } from '../../../MoveItemsContext';
import useMemberTenantHoldings from '../../../../hooks/useMemberTenantHoldings';

import { hasMemberTenantPermission } from '../../../../utils';

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
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const canViewHoldingsAndItems = hasMemberTenantPermission('ui-inventory.instance.view', memberTenantId, userTenantPermissions);
  const canCreateItem = hasMemberTenantPermission('ui-inventory.item.create', memberTenantId, userTenantPermissions);
  const canCreateHoldings = hasMemberTenantPermission('ui-inventory.holdings.create', memberTenantId, userTenantPermissions);

  const { holdings, isLoading } = useMemberTenantHoldings(instance, memberTenantId, userTenantPermissions);

  if (isEmpty(holdings)) return null;

  const renderHoldings = () => (
    canViewHoldingsAndItems
      ? (
        <MoveItemsContext>
          <HoldingsList
            holdings={holdings}
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
      )
      : (
        <LimitedHoldingsList
          instance={instance}
          holdings={holdings}
          tenantId={memberTenantId}
          userTenantPermissions={userTenantPermissions}
          pathToAccordionsState={pathToHoldingsAccordion}
        />
      )
  );

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={`${memberTenantId}.${instance?.id}`}
      label={name}
    >
      <div className={css.memberTenantHoldings}>
        {isLoading
          ? <Loading size="large" />
          : renderHoldings()
        }
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
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MemberTenantHoldings;
