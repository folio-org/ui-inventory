import React from 'react';
import PropTypes from 'prop-types';

import { HoldingContainer } from './Holding';

const HoldingsList = ({
  instance,
  holdings,

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
  />
));

HoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
};

HoldingsList.defaultProps = {
  holdings: [],
};

export default HoldingsList;
