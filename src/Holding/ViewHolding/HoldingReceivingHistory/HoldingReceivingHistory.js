import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import {
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';

import { useControlledAccordion } from '../../../common/hooks';

import useReceivingHistory from './useReceivingHistory';
import HoldingReceivingHistoryList from './HoldingReceivingHistoryList';

import css from './HoldingReceivingHistory.css';

const HoldingReceivingHistory = ({ holding }) => {
  const stripes = useStripes();
  const activeTenant = stripes.okapi.tenant;
  const centralTenant = stripes.user.user?.consortium?.centralTenantId;

  const {
    receivingHistory: activeTenantReceivings,
    isFetching: isFetchingActiveTenantReceivings,
  } = useReceivingHistory(holding, activeTenant);
  const {
    receivingHistory: centralTenantReceivings,
    isFetching: isFetchingCentralTenantReceivings,
  } = useReceivingHistory(holding, centralTenant);

  const controlledAccorion = useControlledAccordion(Boolean(activeTenantReceivings.length || centralTenantReceivings.length));
  const controlledActiveTenantAccorion = useControlledAccordion(Boolean(activeTenantReceivings.length));
  const controlledCentralTenantAccorion = useControlledAccordion(Boolean(centralTenantReceivings.length));

  const renderTenantReceivingsAccordion = (accId, tenantId, tenantReceivings, isLoading, controlledAccorionProps) => {
    const getTenantAccordionLabel = (tenants, id) => tenants?.find(tenant => tenant.id === id).name;

    return (
      <Accordion
        id={accId}
        label={getTenantAccordionLabel(stripes.user.user.tenants, tenantId)}
        className={css.tenantReceivingsAccordion}
        {...controlledAccorionProps}
      >
        <HoldingReceivingHistoryList
          data={tenantReceivings}
          isLoading={isLoading}
          tenantId={tenantId}
        />
      </Accordion>
    );
  };

  return (
    <Accordion
      id="receiving-history-accordion"
      label={<FormattedMessage id="ui-inventory.receivingHistory" />}
      {...controlledAccorion}
    >
      {checkIfUserInMemberTenant(stripes) ? (
        <>
          {renderTenantReceivingsAccordion(
            'active-receivings-accordion',
            activeTenant,
            activeTenantReceivings,
            isFetchingActiveTenantReceivings,
            controlledActiveTenantAccorion,
          )}
          {renderTenantReceivingsAccordion(
            'central-receivings-accordion',
            centralTenant,
            centralTenantReceivings,
            isFetchingCentralTenantReceivings,
            controlledCentralTenantAccorion,
          )}
        </>
      ) : (
        <HoldingReceivingHistoryList
          data={activeTenantReceivings}
          isLoading={isFetchingActiveTenantReceivings}
          tenantId={activeTenant}
        />
      )
      }
    </Accordion>
  );
};

HoldingReceivingHistory.propTypes = {
  holding: PropTypes.object,
};

export default HoldingReceivingHistory;
