import React, {
  useState,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Row,
  Col,
  Icon,
} from '@folio/stripes/components';

import { DataContext } from '../../../contexts';
import { callNumberLabel } from '../../../utils';
import HoldingButtonsGroup from './HoldingButtonsGroup';

const HoldingAccordion = ({
  children,
  holding,
  holdings,
  onViewHolding,
  onAddItem,
  withMoveDropdown,
  resources: {
    instanceHoldingItems,
  },
}) => {
  const { locationsById } = useContext(DataContext);
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';
  const [open, setOpen] = useState(false);
  const [openFirstTime, setOpenFirstTime] = useState(false);
  const handleAccordionToggle = () => {
    if (!open && !openFirstTime) {
      setOpenFirstTime(true);
    }

    setOpen(!open);
  };

  const itemCount = instanceHoldingItems?.other?.totalRecords;
  const holdingButtonsGroup = <HoldingButtonsGroup
    holding={holding}
    holdings={holdings}
    itemCount={itemCount}
    locationsById={locationsById}
    onViewHolding={onViewHolding}
    onAddItem={onAddItem}
    withMoveDropdown={withMoveDropdown}
    isOpen={open}
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
              location: labelLocation,
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

HoldingAccordion.manifest = Object.freeze({
  instanceHoldingItems: {
    type: 'okapi',
    records: 'items',
    path: 'inventory/items',
    params: {
      query: 'holdingsRecordId==!{holding.id}',
      limit: '1',
    },
    resourceShouldRefresh: true,
    abortOnUnmount: true,
  },
});

HoldingAccordion.propTypes = {
  resources: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  withMoveDropdown: PropTypes.bool,
  children: PropTypes.func,
};

export default stripesConnect(HoldingAccordion);
