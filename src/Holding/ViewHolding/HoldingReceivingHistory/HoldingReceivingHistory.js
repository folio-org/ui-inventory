import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import { useStripes } from '@folio/stripes/core';

import { useControlledAccordion } from '../../../common/hooks';
import { isUserInConsortiumMode } from '../../../utils';

import useReceivingHistory from './useReceivingHistory';
import HoldingReceivingHistoryList from './HoldingReceivingHistoryList';

import css from './HoldingReceivingHistory.css';

const activeTenantReceivings = [{
  displaySummary: 'test',
  copyNumber: '111111',
  enumeration: 'en.1',
  chronology: '123',
  receivedDate: '03.01.2001',
  comment: 'tst comment',
  displayToPublic: true,
  source: 'user',
}, {
  displaySummary: 'best',
  copyNumber: '2222',
  enumeration: 'en.2',
  chronology: '210',
  receivedDate: '03.01.2003',
  comment: 'best comment',
  displayToPublic: false,
  source: 'receiving',
}];

const centralTenantReceivings = [{
  displaySummary: 'test222',
  copyNumber: '111111',
  enumeration: 'en.1',
  chronology: '123',
  receivedDate: '03.01.2001',
  comment: 'tst comment',
  displayToPublic: true,
  source: 'user',
}, {
  displaySummary: 'best2222',
  copyNumber: '2222',
  enumeration: 'en.2',
  chronology: '210',
  receivedDate: '03.01.2003',
  comment: 'best comment',
  displayToPublic: false,
  source: 'receiving',
}];

const HoldingReceivingHistory = ({ holding }) => {
  const stripes = useStripes();
  const activeTenant = stripes.okapi.tenant;
  const centralTenant = stripes.user.user?.consortium?.centralTenantId;

  const {
    // receivingHistory: activeTenantReceivings,
    isLoading: isLoadingActiveTenantReceivings,
  } = useReceivingHistory(holding, activeTenant);
  const {
    // receivingHistory: centralTenantReceivings,
    isLoading: isLoadingCentralTenantReceivings,
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
      id="acc07"
      label={<FormattedMessage id="ui-inventory.receivingHistory" />}
      {...controlledAccorion}
    >
      {(isUserInConsortiumMode(stripes) && activeTenant !== centralTenant) ? (
        <>
          {renderTenantReceivingsAccordion(
            'active-receivings-accordion',
            activeTenant,
            activeTenantReceivings,
            isLoadingActiveTenantReceivings,
            controlledActiveTenantAccorion,
          )}
          {renderTenantReceivingsAccordion(
            'central-receivings-accordion',
            centralTenant,
            centralTenantReceivings,
            isLoadingCentralTenantReceivings,
            controlledCentralTenantAccorion,
          )}
        </>
      ) : (
        <HoldingReceivingHistoryList
          data={activeTenantReceivings}
          isLoading={isLoadingActiveTenantReceivings}
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
