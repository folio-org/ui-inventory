import React, {
  useContext,
  memo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

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
  const [itemsToShow, setItemsToShow] = useState([]);
  const searchParams = {
    limit: 200,
    offset,
  };

  const { isFetching, items } = useHoldingItemsQuery(holding.id, { searchParams });
  const { totalRecords } = useHoldingItemsQuery(holding.id, { searchParams: { limit: 0 }, key: 'itemCount' });

  useEffect(() => {
    if (!isEmpty(items)) {
      setItemsToShow(items);
    }
  }, [items]);

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
      items={itemsToShow}
      total={totalRecords}
      draggable={draggable}
      droppable={droppable}
      isFetching={isFetching}
    />
  );
};

ItemsListContainer.propTypes = {
  holding: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool
};

export default memo(ItemsListContainer);
