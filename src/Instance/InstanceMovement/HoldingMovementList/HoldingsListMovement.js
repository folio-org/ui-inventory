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
  tenantId,
  showViewHoldingsButton,
  showAddItemButton,
  isBarcodeAsHotlink,
  holdings = [],
  draggable = false,
  droppable = false,
  pathToAccordionsState = [],
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
              tenantId={tenantId}
              showViewHoldingsButton={showViewHoldingsButton}
              showAddItemButton={showAddItemButton}
              isBarcodeAsHotlink={isBarcodeAsHotlink}
              pathToAccordionsState={pathToAccordionsState}
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
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  isBarcodeAsHotlink: PropTypes.bool,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  tenantId: PropTypes.string,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

export default HoldingsListMovement;
