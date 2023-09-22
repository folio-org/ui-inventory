import React from 'react';

import { Accordion } from '@folio/stripes/components';
import { useInstanceHoldingsQuery } from '../../../providers';
import { isEmpty } from 'lodash';
import HoldingsList from '../../HoldingsList/HoldingsList';
import { MoveItemsContext } from '../../MoveItemsContext';
import { InstanceNewHolding } from '../InstanceNewHolding';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({
  affiliation,
  instance,
}) => {
  const {
    tenantName,
    tenantId,
  } = affiliation;
  const { holdingsRecords } = useInstanceHoldingsQuery(instance?.id, { tenantId });

  if (isEmpty(holdingsRecords)) return null;

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={`${tenantName}-holdings`}
      label={tenantName}
      closedByDefault
    >
      <div className={css.memberTenantHoldings}>
        <MoveItemsContext>
          <HoldingsList
            holdings={holdingsRecords}
            instance={instance}
            draggable={false}
            droppable={false}
            tenantId={tenantId}
            isViewHoldingsDisabled={true}
            isAddItemDisabled={true}
          />
        </MoveItemsContext>
      </div>
      <InstanceNewHolding instance={instance} />
    </Accordion>
  );
};

export default MemberTenantHoldings;
