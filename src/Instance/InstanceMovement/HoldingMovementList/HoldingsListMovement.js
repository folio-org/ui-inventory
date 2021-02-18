import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { HoldingContainer } from '../../HoldingsList/Holding';
import DnDContext from '../../DnDContext';

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
    isItemsDragSelected,
    selectHoldingsForDrag,
    isHoldingDragSelected,
    getDraggingItems,
    activeDropZone,
    draggingHoldingsCount,
  } = useContext(DnDContext);

  const dropStyles = useMemo(() => (
    getDropStyle(holdings.length)
  ), [holdings.length]);
  return (
    <>
      {
        holdings.length ? (
          holdings.map((holding, index) => (
            <HoldingContainer
              key={`items_${holding.id}`}
              instance={instance}
              holding={holding}

              isDraggable
              draggable={draggable}
              droppable={droppable}
              activeDropZone={activeDropZone}
              selectItemsForDrag={selectItemsForDrag}
              selectHoldingsForDrag={selectHoldingsForDrag}
              isHoldingDragSelected={isHoldingDragSelected}
              isItemsDragSelected={isItemsDragSelected}
              getDraggingItems={getDraggingItems}
              holdingIndex={index}
              draggingHoldingsCount={draggingHoldingsCount}
            />
          ))
        ) : (
          <div
            data-test-empty-drop-zone
            style={dropStyles}
          >
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
