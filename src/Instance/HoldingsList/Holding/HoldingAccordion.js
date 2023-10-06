import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  Icon,
} from '@folio/stripes/components';

import { callNumberLabel } from '../../../utils';
import {
  useLocationsQuery,
  useHoldingItemsQuery,
} from '../../../hooks';

import HoldingButtonsGroup from './HoldingButtonsGroup';

const HoldingAccordion = ({
  children,
  holding,
  holdings,
  onViewHolding,
  onAddItem,
  withMoveDropdown,
  tenantId,
  isViewHoldingsDisabled,
  isAddItemDisabled,
}) => {
  const searchParams = {
    limit: 0,
    offset: 0,
  };

  const [open, setOpen] = useState(false);
  const [openFirstTime, setOpenFirstTime] = useState(false);
  const { totalRecords, isFetching } = useHoldingItemsQuery(holding.id, { searchParams, key: 'itemCount', tenantId });
  const { data: locations } = useLocationsQuery({ tenantId });

  if (!locations) return null;

  const locationsById = keyBy(locations, 'id');

  const labelLocation = locationsById[holding.permanentLocationId];
  const labelLocationName = labelLocation?.name ?? '';

  const handleAccordionToggle = () => {
    if (!open && !openFirstTime) {
      setOpenFirstTime(true);
    }

    setOpen(!open);
  };

  const holdingButtonsGroup = <HoldingButtonsGroup
    holding={holding}
    holdings={holdings}
    itemCount={isFetching ? null : totalRecords}
    locationsById={locationsById}
    onViewHolding={onViewHolding}
    onAddItem={onAddItem}
    withMoveDropdown={withMoveDropdown}
    isOpen={open}
    tenantId={tenantId}
    isViewHoldingsDisabled={isViewHoldingsDisabled}
    isAddItemDisabled={isAddItemDisabled}
  />;

  const location = labelLocation?.isActive ?
    labelLocationName :
    <FormattedMessage
      id="ui-inventory.inactive.paneTitle"
      values={{
        location: labelLocationName,
      }}
    />;

  return (
    <Accordion
      id={holding.id}
      open={open}
      onToggle={handleAccordionToggle}
      label={(
        <>
          <FormattedMessage
            id="ui-inventory.holdingsHeader"
            values={{
              location,
              callNumber: callNumberLabel(holding),
              copyNumber: holding.copyNumber,
            }}
          />
          {holding.discoverySuppress &&
          <span>
            <Icon
              size="medium"
              icon="exclamation-circle"
              status="warn"
            />
          </span>
          }
        </>
      )}
      displayWhenOpen={holdingButtonsGroup}
      displayWhenClosed={holdingButtonsGroup}
    >
      {
        (open || openFirstTime) &&
        <Row>
          <Col sm={12}>
            {children}
          </Col>
        </Row>
      }
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
  isViewHoldingsDisabled: PropTypes.bool,
  isAddItemDisabled: PropTypes.bool,
};

export default HoldingAccordion;
