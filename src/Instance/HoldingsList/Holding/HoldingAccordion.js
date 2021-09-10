import React, {
  useState,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  Icon,
} from '@folio/stripes/components';

import { DataContext } from '../../../contexts';
import { callNumberLabel } from '../../../utils';
import HoldingButtonsGroup from './HoldingButtonsGroup';
import useHoldingItemsQuery from '../../../hooks/useHoldingItemsQuery';

const HoldingAccordion = ({
  children,
  holding,
  holdings,
  onViewHolding,
  onAddItem,
  withMoveDropdown,
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
  const { items, isFetching } = useHoldingItemsQuery(holding.id);

  const holdingButtonsGroup = <HoldingButtonsGroup
    holding={holding}
    holdings={holdings}
    itemCount={isFetching ? null : items.length}
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

HoldingAccordion.propTypes = {
  holding: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  withMoveDropdown: PropTypes.bool,
  children: PropTypes.func,
};

export default HoldingAccordion;
