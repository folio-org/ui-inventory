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

import { DEFAULT_ITEM_TABLE_SORTBY_FIELD } from '../../constants';

const ItemsListContainer = ({
  tenantId,
  holding,
  draggable,
  droppable,
  isBarcodeAsHotlink,
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
  const [sortBy, setSortBy] = useState(DEFAULT_ITEM_TABLE_SORTBY_FIELD);
  const searchParams = {
    sortBy,
    limit: 200,
    offset,
  };

  const { isFetching, items } = useHoldingItemsQuery(holding.id, tenantId, { searchParams });
  const { totalRecords } = useHoldingItemsQuery(holding.id, tenantId, { searchParams: { limit: 0 }, key: 'itemCount' });

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
      setSorting={setSortBy}
      items={itemsToShow}
      total={totalRecords}
      draggable={draggable}
      droppable={droppable}
      isFetching={isFetching}
      isBarcodeAsHotlink={isBarcodeAsHotlink}
      tenantId={tenantId}
    />
  );
};

ItemsListContainer.propTypes = {
  holding: PropTypes.object.isRequired,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  tenantId: PropTypes.string,
  isBarcodeAsHotlink: PropTypes.bool,
};

export default memo(ItemsListContainer);
