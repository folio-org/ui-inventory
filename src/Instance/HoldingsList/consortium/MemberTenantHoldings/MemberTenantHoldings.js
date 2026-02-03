import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useQueryClient } from 'react-query';

import {
  Accordion,
  Loading,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useNamespace,
  useStripes,
  useUserTenantPermissions,
} from '@folio/stripes/core';

import DragAndDropProvider from '../../../../dnd/DragAndDropProvider';
import HoldingsList from '../../HoldingsList';
import { LimitedHoldingsList } from '../LimitedHoldingsList';
import { InstanceNewHolding } from '../../../ViewInstance/components/InstanceDetails/InstanceNewHolding';

import { useHoldingsFromStorage, useMemberTenantHoldings } from '../../../../hooks';
import { hasMemberTenantPermission } from '../../../../utils';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({ memberTenant, instance }) => {
  const {
    name,
    id: memberTenantId,
  } = memberTenant;
  const stripes = useStripes();
  const queryClient = useQueryClient();

  const [namespace] = useNamespace({ key: 'user-self-permissions' });
  const accordionId = `${memberTenantId}.${instance?.id}`;
  const [accordionStatus, updateAccordionStatus] = useHoldingsFromStorage({ defaultValue: {} });

  const isAccordionOpen = accordionStatus[accordionId] || false;

  const {
    userPermissions,
    isFetching: isUserTenantPermissionsLoading,
  } = useUserTenantPermissions(
    { tenantId: memberTenantId },
    { enabled: !!memberTenantId && isAccordionOpen },
  );

  useEffect(() => {
    if (!isAccordionOpen) {
      queryClient.cancelQueries([namespace, memberTenantId]);
    }
  }, [isAccordionOpen, memberTenantId, queryClient]);

  const pathToHoldingsAccordion = ['consortialHoldings', memberTenantId];
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const canViewHoldingsAndItems = hasMemberTenantPermission('ui-inventory.instance.view', memberTenantId, userPermissions);
  const canCreateHoldings = hasMemberTenantPermission('ui-inventory.holdings.create', memberTenantId, userPermissions);

  const { holdings, isLoading } = useMemberTenantHoldings(instance, memberTenantId, userPermissions);

  const onToggle = ({ id }) => {
    updateAccordionStatus(current => ({
      ...current,
      [id]: !current[id],
    }));
  };

  if (isEmpty(holdings)) return null;

  const renderHoldings = () => (
    canViewHoldingsAndItems
      ? (
        <DragAndDropProvider>
          <HoldingsList
            instanceId={instance.id}
            tenantId={memberTenantId}
            holdings={holdings}
            pathToAccordionsState={pathToHoldingsAccordion}
            isItemsMovement={false}
            isHoldingsMovement={false}
          />
        </DragAndDropProvider>
      )
      : (
        <LimitedHoldingsList
          instance={instance}
          holdings={holdings}
          tenantId={memberTenantId}
          userTenantPermissions={userPermissions}
          pathToAccordionsState={pathToHoldingsAccordion}
        />
      )
  );

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={accordionId}
      label={name}
      open={isAccordionOpen}
      onToggle={onToggle}
    >
      <div className={css.memberTenantHoldings}>
        {isLoading || isUserTenantPermissionsLoading
          ? <Loading size="large" />
          : renderHoldings()
        }
      </div>
      <InstanceNewHolding
        instance={instance}
        tenantId={memberTenantId}
        isVisible={!isUserInCentralTenant && canCreateHoldings}
      />
    </Accordion>
  );
};

MemberTenantHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  memberTenant: PropTypes.object.isRequired,
};

export default MemberTenantHoldings;
