import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { HoldingMovementContainer } from './HoldingMovement';
import DataContext from '../../contexts/DataContext';

const HoldingsListMovement = ({
  instance,
  holdings,

  draggable,
  droppable,
}) => {
  const {
    selectItemsForDrag,
    ifItemsDragSelected,
    getDraggingItems,
    activeDropZone,
    referenceData,
  } = useContext(DataContext);

  return (
    <>
      {
        holdings.map((holding, index) => (
          <HoldingMovementContainer
            key={`items_${holding.id}`}
            instance={instance}
            holding={holding}
            referenceData={referenceData}

            draggable={draggable}
            droppable={droppable}
            activeDropZone={activeDropZone}
            selectItemsForDrag={selectItemsForDrag}
            ifItemsDragSelected={ifItemsDragSelected}
            getDraggingItems={getDraggingItems}
            holdingindex={index}
          />
        ))
      }
    </>
  );
};

HoldingsListMovement.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
};

HoldingsListMovement.defaultProps = {
  holdings: [],
};

export default HoldingsListMovement;
