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
import { useHoldingsAccordionState } from '../../../hooks';

import css from './MemberTenantHoldings.css';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
}) => {
  const {
    name,
    id,
  } = memberTenant;
  const instanceId = instance?.id;
  const stripes = useStripes();

  const pathToAccordion = ['consortialHoldings', id, '_state'];
  const pathToHoldingsAccordion = ['consortialHoldings', id];
  const [isMemberTenantAccOpen, setMemberTenantAccOpen] = useHoldingsAccordionState({ instanceId, pathToAccordion });

  const { holdingsRecords, isLoading } = useInstanceHoldingsQuery(instance?.id, { tenantId: id });
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  if (isEmpty(holdingsRecords)) return null;

  return (
    <Accordion
      className={css.memberTenantHoldings}
      id={`${name}-holdings`}
      label={name}
      open={isMemberTenantAccOpen}
      onToggle={() => setMemberTenantAccOpen(prevValue => !prevValue)}
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
                pathToAccordionsState={pathToHoldingsAccordion}
              />
            </MoveItemsContext>
          )}
      </div>
      {!isUserInCentralTenant && (
        <InstanceNewHolding instance={instance} />
      )}
    </Accordion>
  );
};

MemberTenantHoldings.propTypes = {
  instance: PropTypes.object.isRequired,
  memberTenant: PropTypes.object.isRequired,
};

export default MemberTenantHoldings;
