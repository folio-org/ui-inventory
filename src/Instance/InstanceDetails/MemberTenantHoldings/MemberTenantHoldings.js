import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  Accordion,
  Loading,
} from '@folio/stripes/components';

import { HoldingsList } from '../../HoldingsList';
import { InstanceNewHolding } from '../InstanceNewHolding';
import { MoveItemsContext } from '../../MoveItemsContext';

import { useInstanceHoldingsQuery } from '../../../providers';

import css from './MemberTenantHoldings.css';
import HoldingsListContainer from '../../HoldingsList/HoldingsListContainer';

const MemberTenantHoldings = ({
  memberTenant,
  instance,
}) => {
  const {
    name,
    id,
  } = memberTenant;
  const { holdingsRecords, isLoading } = useInstanceHoldingsQuery(instance?.id, { tenantId: id });

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
              />
            </MoveItemsContext>
          )}
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
