import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import {
  Accordion,
  Col,
  KeyValue,
  Loading,
  Row,
} from '@folio/stripes/components';

import { useControlledAccordion } from '../../../common/hooks';

import useHoldingOrderLines from './useHoldingOrderLines';

import HoldingAcquisitionList from './HoldingAcquisitionList';

import css from './HoldingAcquisitions.css';

const HoldingAcquisitions = ({ holding, withSummary }) => {
  const stripes = useStripes();
  const activeTenant = stripes.okapi.tenant;
  const centralTenant = stripes.user.user?.consortium?.centralTenantId;

  const {
    isFetching: isFetchingActiveTenantOrderLines,
    holdingOrderLines: activeTenantOrderLines,
  } = useHoldingOrderLines(activeTenant, holding.id, { enabled: withSummary });
  const {
    isFetching: isFetchingCentralTenantOrderLines,
    holdingOrderLines: centralTenantOrderLines,
  } = useHoldingOrderLines(centralTenant, holding.id, { enabled: withSummary });

  const controlledAccorion = useControlledAccordion(
    Boolean(
      activeTenantOrderLines.length
      || centralTenantOrderLines.length
      || holding.acquisitionMethod
      || holding.acquisitionFormat
      || holding.receiptStatus
    )
  );
  const controlledActiveTenantOrderLinesAccorion = useControlledAccordion(Boolean(activeTenantOrderLines?.length));
  const controlledCetralTenantOrderLinesAccorion = useControlledAccordion(Boolean(centralTenantOrderLines?.length));

  if (isFetchingActiveTenantOrderLines || isFetchingCentralTenantOrderLines) return <Loading size="large" />;

  const renderTenantOrderLinesAccordion = (
    accId,
    tenantId,
    tenantOrderLines,
    isLoading,
    controlledAccorionProps,
    isActiveTenantAcqisition = false,
  ) => {
    const getTenantAccordionLabel = (tenants, id) => tenants?.find(tenant => tenant.id === id).name;

    return (
      <Accordion
        id={accId}
        label={getTenantAccordionLabel(stripes.user.user.tenants, tenantId)}
        className={css.tenantHoldingOrderLinesAccordion}
        {...controlledAccorionProps}
      >
        <HoldingAcquisitionList
          holdingOrderLines={tenantOrderLines}
          isLoading={isLoading}
          tenantId={tenantId}
          isActiveTenantAcqisition={isActiveTenantAcqisition}
        />
      </Accordion>
    );
  };

  return (
    <Accordion
      id="acquisition-accordion"
      label={<FormattedMessage id="ui-inventory.acquisition" />}
      {...controlledAccorion}
    >
      <Row>
        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acquisitionMethod" />}
            value={holding.acquisitionMethod}
          />
        </Col>

        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.acquisitionFormat" />}
            value={holding.acquisitionFormat}
          />
        </Col>

        <Col sm={2}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory.receiptStatus" />}
            value={holding.receiptStatus}
          />
        </Col>
      </Row>

      {
        withSummary && (checkIfUserInMemberTenant(stripes) ? (
          <>
            {renderTenantOrderLinesAccordion(
              'active-tenant-order-lines-accordion',
              activeTenant,
              activeTenantOrderLines,
              isFetchingActiveTenantOrderLines,
              controlledActiveTenantOrderLinesAccorion,
              true,
            )}
            {renderTenantOrderLinesAccordion(
              'central-tenant-order-lines-accordion',
              centralTenant,
              centralTenantOrderLines,
              isFetchingCentralTenantOrderLines,
              controlledCetralTenantOrderLinesAccorion,
            )}
          </>
        ) : (
          <HoldingAcquisitionList
            holdingOrderLines={activeTenantOrderLines}
            isLoading={isFetchingActiveTenantOrderLines}
            tenantId={activeTenant}
          />
        ))
      }
    </Accordion>
  );
};

HoldingAcquisitions.propTypes = {
  holding: PropTypes.object.isRequired,
  withSummary: PropTypes.bool,
};

export default HoldingAcquisitions;
