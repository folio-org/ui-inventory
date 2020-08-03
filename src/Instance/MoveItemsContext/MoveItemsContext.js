import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import {
  Loading,
} from '@folio/stripes/components';
import DnDContext from '../DnDContext';
import {
  isItemsSelected,
  selectItems,
} from '../utils';

const MoveItemsContext = ({ children, moveItems }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [activeDropZone, setActiveDropZone] = useState();

  const onDragStart = useCallback((result) => {
    setActiveDropZone(result.source.droppableId);
  }, []);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const from = result.source.droppableId;
    const to = result.destination.droppableId;

    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    if (!items.length) {
      items.push(result.draggableId);
    }

    setIsMoving(true);

    moveItems(to, items)
      .finally(() => {
        setIsMoving(false);
      });

    setSelectedItemsMap((prevItemsMap) => ({
      ...prevItemsMap,
      [from]: undefined,
    }));
    setActiveDropZone(undefined);
  }, [selectedItemsMap]);

  const getDraggingItems = useCallback(() => {
    const fromHolding = selectedItemsMap[activeDropZone] || {};

    return {
      items: Object.keys(fromHolding).filter(item => fromHolding[item]),
    };
  }, [activeDropZone, selectedItemsMap]);

  const isItemsDragSelected = useCallback((items) => {
    return isItemsSelected(items, selectedItemsMap);
  }, [selectedItemsMap]);

  const selectItemsForDrag = useCallback((items) => {
    const holdingId = items[0].holdingsRecordId;

    setSelectedItemsMap((prevItemsMap) => {
      return selectItems(prevItemsMap, holdingId, items);
    });
  }, []);

  if (isMoving) {
    return <Loading size="large" />;
  }

  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <DnDContext.Provider
        value={{
          activeDropZone,
          selectItemsForDrag,
          isItemsDragSelected,
          getDraggingItems,
        }}
      >
        {children}
      </DnDContext.Provider>
    </DragDropContext>
  );
};

MoveItemsContext.propTypes = {
  children: PropTypes.node.isRequired,
  moveItems: PropTypes.func.isRequired,
};

export default MoveItemsContext;
