import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import {
  Accordion,
  Row,
  Col,
} from '@folio/stripes/components';

import { HoldingButtonsGroup } from './HoldingButtonsGroup';
import HoldingAccordionLabel from './HoldingAccordionLabel';
import {
  useLocationsQuery,
  useHoldingItemsQuery,
} from '../../../hooks';

const HoldingAccordion = ({
  children,
  holding,
  holdings,
  onViewHolding,
  onAddItem,
  withMoveDropdown,
  tenantId,
  showViewHoldingsButton,
  showAddItemButton,
  pathToAccordionsState,
}) => {
  const searchParams = {
    limit: 0,
    offset: 0,
  };

  const pathToAccordion = [...pathToAccordionsState, holding?.id];
  const { totalRecords, isFetching } = useHoldingItemsQuery(holding.id, { searchParams, key: 'itemCount', tenantId });
  const { data: locations } = useLocationsQuery({ tenantId });

  if (!locations) return null;

  const locationsById = keyBy(locations, 'id');
  const labelLocation = locationsById[holding.permanentLocationId];
  const labelLocationName = labelLocation?.name ?? '';

  const holdingButtonsGroup = isOpen => <HoldingButtonsGroup
    holding={holding}
    holdings={holdings}
    itemCount={isFetching ? null : totalRecords}
    locationsById={locationsById}
    onViewHolding={onViewHolding}
    onAddItem={onAddItem}
    withMoveDropdown={withMoveDropdown}
    isOpen={isOpen}
    tenantId={tenantId}
    showViewHoldingsButton={showViewHoldingsButton}
    showAddItemButton={showAddItemButton}
  />;

  const location = labelLocation?.isActive ?
    labelLocationName :
    <FormattedMessage
      id="ui-inventory.inactive.paneTitle"
      values={{
        location: labelLocationName,
      }}
    />;

  const accId = pathToAccordion.join('.');
  const accordionLabel = (
    <HoldingAccordionLabel
      location={location}
      holding={holding}
    />
  );

  return (
    <Accordion
      id={accId}
      label={accordionLabel}
      displayWhenOpen={holdingButtonsGroup(true)}
      displayWhenClosed={holdingButtonsGroup(false)}
      closedByDefault
    >
      {open => (
        open && (
          <Row>
            <Col sm={12}>
              {children}
            </Col>
          </Row>
        )
      )}
    </Accordion>
  );
};

HoldingAccordion.propTypes = {
  holding: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  withMoveDropdown: PropTypes.bool,
  children: PropTypes.object,
  tenantId: PropTypes.string,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
};

export default HoldingAccordion;
