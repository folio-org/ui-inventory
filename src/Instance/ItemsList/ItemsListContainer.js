import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';

import DnDContext from '../DnDContext';
import ItemsList from './ItemsList';

const ItemsListContainer = ({
  holding,
  items,
  draggable,
  droppable,
}) => {
  const {
    selectItemsForDrag,
    isItemsDragSelected,
    getDraggingItems,
    activeDropZone,
    isItemsDroppable,
  } = useContext(DnDContext);

  return (
    <ItemsList
      isItemsDragSelected={isItemsDragSelected}
      selectItemsForDrag={selectItemsForDrag}
      getDraggingItems={getDraggingItems}
      activeDropZone={activeDropZone}
      isItemsDroppable={isItemsDroppable}
      holding={holding}
      items={items}
      draggable={draggable}
      droppable={droppable}
    />
  );
};

ItemsListContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  holding: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool
};

export default memo(ItemsListContainer);
