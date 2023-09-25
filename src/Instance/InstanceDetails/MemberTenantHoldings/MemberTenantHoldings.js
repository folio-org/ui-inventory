import React from 'react';
import { isEmpty } from 'lodash';

import { Accordion } from '@folio/stripes/components';

import HoldingsList from '../../HoldingsList/HoldingsList';
import { MoveItemsContext } from '../../MoveItemsContext';
import { InstanceNewHolding } from '../InstanceNewHolding';

import { useInstanceHoldingsQuery } from '../../../providers';

import css from './MemberTenantHoldings.css';
import PropTypes from 'prop-types';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
}) => {
  const {
    tenantName,
    tenantId,
  } = memberTenant;
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
            tenantId={tenantId}
            draggable={false}
            droppable={false}
          />
        </MoveItemsContext>
      </div>
      <InstanceNewHolding instance={instance} />
    </Accordion>
  );
};

MemberTenantHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  memberTenant: PropTypes.object.isRequired,
};

export default MemberTenantHoldings;
