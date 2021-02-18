import React from 'react';
import PropTypes from 'prop-types';

import { HoldingContainer } from './Holding';

const HoldingsList = ({
  instance,
  holdings,
  referenceData,

  draggable,
  droppable,
}) => {
  return (
    <>
      {
        holdings.map(holding => (
          <HoldingContainer
            key={`items_${holding.id}`}
            instance={instance}
            holding={holding}
            referenceData={referenceData}

            draggable={draggable}
            droppable={droppable}
            holdings={holdings}
          />
        ))
      }
    </>
  );
};

HoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  referenceData: PropTypes.object.isRequired,

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
};

HoldingsList.defaultProps = {
  holdings: [],
};

export default HoldingsList;
