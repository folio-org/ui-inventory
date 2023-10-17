import React from 'react';
import PropTypes from 'prop-types';

import { HoldingContainer } from './Holding';

const HoldingsList = ({
  instance,
  holdings,
  tenantId,
  isViewHoldingsDisabled,
  isAddItemDisabled,
  isBarcodeAsHotlink,
  pathToAccordionsState,
  draggable,
  droppable,
}) => holdings.map(holding => (
  <HoldingContainer
    key={`items_${holding.id}`}
    instance={instance}
    holding={holding}
    draggable={draggable}
    droppable={droppable}
    holdings={holdings}
    tenantId={tenantId}
    isViewHoldingsDisabled={isViewHoldingsDisabled}
    isAddItemDisabled={isAddItemDisabled}
    isBarcodeAsHotlink={isBarcodeAsHotlink}
    pathToAccordionsState={pathToAccordionsState}
  />
));

HoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  tenantId: PropTypes.string,
  isViewHoldingsDisabled: PropTypes.bool,
  isAddItemDisabled: PropTypes.bool,
  isBarcodeAsHotlink: PropTypes.bool,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
};

HoldingsList.defaultProps = {
  holdings: [],
  pathToAccordionsState: [],
};

export default HoldingsList;
