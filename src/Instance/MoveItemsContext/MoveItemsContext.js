import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import {
  Loading,
} from '@folio/stripes/components';
import DataContext from '../../contexts/DataContext';

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

    moveItems(from, to, items)
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

  const ifItemsDragSelected = useCallback((items) => {
    return items.every((item) => Boolean(
      selectedItemsMap[item.holdingsRecordId] && selectedItemsMap[item.holdingsRecordId][item.id]
    ));
  }, [selectedItemsMap]);

  const selectItemsForDrag = useCallback((items) => {
    const holdingId = items[0].holdingsRecordId;

    setSelectedItemsMap((prevItemsMap) => {
      const prevHolding = prevItemsMap[holdingId] || {};
      const prevSelectedCount = Object
        .keys(prevHolding)
        .filter(itemId => prevHolding[itemId])
        .length;

      let newHolding;

      if (items.length > 1 && prevSelectedCount === items.length) {
        newHolding = {};
      } else if (items.length > 1 && prevSelectedCount !== items.length) {
        newHolding = items.reduce((acc, item) => {
          acc[item.id] = true;

          return acc;
        }, {});
      } else {
        newHolding = {
          ...prevHolding,
          [items[0].id]: !prevHolding[items[0].id],
        };
      }

      return {
        ...prevItemsMap,
        [holdingId]: newHolding,
      };
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
      <DataContext.Provider
        value={{
          activeDropZone,
          selectItemsForDrag,
          ifItemsDragSelected,
          getDraggingItems,
        }}
      >
        {children}
      </DataContext.Provider>
    </DragDropContext>
  );
};

MoveItemsContext.propTypes = {
  children: PropTypes.node.isRequired,
  moveItems: PropTypes.func.isRequired,
};

export default MoveItemsContext;
