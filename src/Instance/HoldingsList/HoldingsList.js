import React from 'react';
import PropTypes from 'prop-types';

import { HoldingContainer } from './Holding';

const HoldingsList = ({
  instance,
  holdings,
  tenantId,
  showViewHoldingsButton,
  showAddItemButton,
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
    showViewHoldingsButton={showViewHoldingsButton}
    showAddItemButton={showAddItemButton}
    isBarcodeAsHotlink={isBarcodeAsHotlink}
    pathToAccordionsState={pathToAccordionsState}
  />
));

HoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  tenantId: PropTypes.string,
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
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
