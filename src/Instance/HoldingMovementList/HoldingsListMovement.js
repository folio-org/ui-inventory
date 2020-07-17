import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { HoldingMovementContainer } from './HoldingMovement';
import DataContext from '../../contexts/DataContext';

const getDropStyle = (holdingsLength) => {
  return {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '20px',
    height: 'fit content',
    marginBottom: '5px',
    padding: '10px',
    background: holdingsLength ? undefined : 'rgba(0, 0, 0, 0.2)',
  };
};

const HoldingsListMovement = ({
  instance,
  holdings,

  draggable,
  droppable,
}) => {
  const {
    selectItemsForDrag,
    ifItemsDragSelected,
    selectHoldingsForDrag,
    ifHoldingDragSelected,
    getDraggingItems,
    activeDropZone,
    referenceData,
    draggingHoldingsCount,
  } = useContext(DataContext);

  const dropStyles = useMemo(() => (
    getDropStyle(holdings.length)
  ), [holdings.length]);

  return (
    <>
      {
        holdings.length ? (
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
              selectHoldingsForDrag={selectHoldingsForDrag}
              ifHoldingDragSelected={ifHoldingDragSelected}
              ifItemsDragSelected={ifItemsDragSelected}
              getDraggingItems={getDraggingItems}
              holdingindex={index}
              draggingHoldingsCount={draggingHoldingsCount}
            />
          ))
        ) : (
          <div style={dropStyles}>
            <FormattedMessage id="ui-inventory.moveItems.instance.dropZone" />
          </div>
        )
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
