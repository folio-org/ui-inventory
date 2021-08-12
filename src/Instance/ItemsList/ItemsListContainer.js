import React, { useContext, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Loading,
} from '@folio/stripes/components';

import DnDContext from '../DnDContext';
import ItemsList from './ItemsList';

import useHoldingItemsQuery from '../../hooks/useHoldingItemsQuery';

const ItemsListContainer = ({
  holding,
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
  const { isLoading, items } = useHoldingItemsQuery(holding.id);

  if (isLoading) {
    return <Loading size="large" />;
  }

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
  holding: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool
};

export default memo(ItemsListContainer);
