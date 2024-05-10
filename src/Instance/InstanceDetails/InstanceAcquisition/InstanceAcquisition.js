import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import { useControlledAccordion } from '../../../common';
import { isUserInConsortiumMode } from '../../../utils';
import useInstanceAcquisition from './useInstanceAcquisition';

import TenantAcquisition from './TenantAcquisition';

import css from './InstanceAcquisition.css';

const InstanceAcquisition = ({ accordionId, instanceId }) => {
  const stripes = useStripes();
  const activeTenant = stripes.okapi.tenant;
  const centralTenant = stripes.user.user?.consortium?.centralTenantId;

  const {
    isLoading: isLoadingActiveTenantAcquisition,
    instanceAcquisition: activeTenantAcquisition,
  } = useInstanceAcquisition(instanceId, activeTenant);
  const {
    isLoading: isLoadingCentralTenantAcquisition,
    instanceAcquisition: centralTenantAcquisition,
  } = useInstanceAcquisition(instanceId, centralTenant);

  const controlledAcqAccorion = useControlledAccordion(Boolean(activeTenantAcquisition?.length || centralTenantAcquisition?.length));
  const controlledActiveTenantAcqAccorion = useControlledAccordion(Boolean(activeTenantAcquisition?.length));
  const controlledCetralTenantAcqAccorion = useControlledAccordion(Boolean(centralTenantAcquisition?.length));

  if (!(stripes.hasInterface('order-lines') &&
    stripes.hasInterface('orders') &&
    stripes.hasInterface('acquisitions-units'))) return null;

  const getTenantAccordionLabel = (tenants, id) => tenants?.find(tenant => tenant.id === id).name;

  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-inventory.acquisition" />}
      {...controlledAcqAccorion}
    >
      {isUserInConsortiumMode(stripes) ? (
        <>
          <Accordion
            id="active-tenant-acquisition-accordion"
            label={getTenantAccordionLabel(stripes.user.user.tenants, activeTenant)}
            className={css.tenantAcquisitionAccordion}
            {...controlledActiveTenantAcqAccorion}
          >
            <TenantAcquisition
              acquisitions={activeTenantAcquisition}
              isLoading={isLoadingActiveTenantAcquisition}
              tenantId={activeTenant}
            />
          </Accordion>

          {activeTenant !== centralTenant && (
            <Accordion
              id="central-tenant-acquisition-accordion"
              label={getTenantAccordionLabel(stripes.user.user.tenants, centralTenant)}
              className={css.tenantAcquisitionAccordion}
              {...controlledCetralTenantAcqAccorion}
            >
              <TenantAcquisition
                acquisitions={centralTenantAcquisition}
                isLoading={isLoadingCentralTenantAcquisition}
                tenantId={centralTenant}
              />
            </Accordion>
          )}
        </>
      ) : (
        <TenantAcquisition
          acquisitions={activeTenantAcquisition}
          isLoading={isLoadingActiveTenantAcquisition}
          tenantId={activeTenant}
        />
      )
      }
    </Accordion>
  );
};

InstanceAcquisition.propTypes = {
  accordionId: PropTypes.string.isRequired,
  instanceId: PropTypes.string.isRequired,
};

export default InstanceAcquisition;
