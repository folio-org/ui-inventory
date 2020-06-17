import React from 'react';
import PropTypes from 'prop-types';

import { HoldingContainer } from './Holding';

const HoldingsList = ({
  instance,
  holdings,
  referenceDeata,

  draggable,
  droppable,
  selectItemsForDrag,
  ifItemsDragSelected,
  getDraggingItems,
  activeDropZone,
}) => {
  return (
    <>
      {
        holdings.map(holding => (
          <HoldingContainer
            key={`items_${holding.id}`}
            instance={instance}
            holding={holding}
            referenceDeata={referenceDeata}

            draggable={draggable}
            droppable={droppable}
            activeDropZone={activeDropZone}
            selectItemsForDrag={selectItemsForDrag}
            ifItemsDragSelected={ifItemsDragSelected}
            getDraggingItems={getDraggingItems}
          />
        ))
      }
    </>
  );
};

HoldingsList.propTypes = {
  instance: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  referenceDeata: PropTypes.object.isRequired,

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  selectItemsForDrag: PropTypes.func.isRequired,
  ifItemsDragSelected: PropTypes.func.isRequired,
  getDraggingItems: PropTypes.func.isRequired,
  activeDropZone: PropTypes.string,
};

HoldingsList.defaulProps = {
  holdings: [],
};

export default HoldingsList;
