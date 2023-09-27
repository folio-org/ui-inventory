import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { Accordion } from '@folio/stripes/components';

import HoldingsList from '../../HoldingsList/HoldingsList';
import { MoveItemsContext } from '../../MoveItemsContext';
import { InstanceNewHolding } from '../InstanceNewHolding';

import { useInstanceHoldingsQuery } from '../../../providers';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
}) => {
  const {
    name,
    id,
  } = memberTenant;
  const { holdingsRecords } = useInstanceHoldingsQuery(instance?.id, { tenantId: id });

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
