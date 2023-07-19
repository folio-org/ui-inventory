import React, { useContext, memo, useState } from 'react';
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

  const [offset, setOffset] = useState(0);
  const searchParams = {
    limit: 200,
    offset,
  };

  const { isFetching, items, totalRecords } = useHoldingItemsQuery(holding.id, { searchParams });

  if (isFetching) {
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
      offset={offset}
      setOffset={setOffset}
      items={items}
      total={totalRecords}
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
