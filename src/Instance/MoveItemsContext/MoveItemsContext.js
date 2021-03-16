import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import {
  Loading,
} from '@folio/stripes/components';

import { useConfirmationModal } from '../../common';
import * as RemoteStorage from '../../RemoteStorageService';
import DnDContext from '../DnDContext';
import {
  isItemsSelected,
  selectItems,
} from '../utils';
import * as Move from '../Move';
import { Confirmation } from './Confirmation';


const MoveItemsContext = ({ children }) => {
  const confirmation = useConfirmationModal();

  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [activeDropZone, setActiveDropZone] = useState();
  const [count, setCount] = useState();

  const onDragStart = useCallback((result) => {
    setActiveDropZone(result.source.droppableId);
  }, []);

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();
  const { moveItems, isMoving } = Move.useItems();

  const setAndMoveItems = useCallback(async (fromHoldingsId, toHoldingsId, result) => {
    const fromSelectedMap = selectedItemsMap[fromHoldingsId] || {};
    const items = Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    if (!items.length) {
      items.push(result.draggableId);
    }

    setCount(items.length);

    try {
      if (checkFromRemoteToNonRemote({ fromHoldingsId, toHoldingsId })) await confirmation.wait();
    } catch {
      return;
    }

    moveItems(fromHoldingsId, toHoldingsId, items);

    setSelectedItemsMap((prevItemsMap) => ({
      ...prevItemsMap,
      [fromHoldingsId]: undefined,
    }));
    setActiveDropZone(undefined);
  }, [selectedItemsMap, checkFromRemoteToNonRemote, confirmation, moveItems]);

  const onSelect = useCallback(({ target }) => {
    const from = target.dataset.itemId;
    const to = target.dataset.toId;

    return setAndMoveItems(from, to, target);
  }, [setAndMoveItems]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return Promise.resolve();

    const from = result.source.droppableId;
    const to = result.destination.droppableId;

    return setAndMoveItems(from, to, result);
  }, [setAndMoveItems]);

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
          selectedItemsMap,
          onSelect,
        }}
      >
        {children}
      </DnDContext.Provider>
      <Confirmation
        count={count}
        {...confirmation.props}
      />
    </DragDropContext>
  );
};

MoveItemsContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MoveItemsContext;
