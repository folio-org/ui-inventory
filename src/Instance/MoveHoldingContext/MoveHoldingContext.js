import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  useIntl,
} from 'react-intl';

import {
  Loading,
  ConfirmationModal,
} from '@folio/stripes/components';
import DnDContext from '../DnDContext';
import {
  isItemsSelected,
  selectItems,
} from '../utils';

const MoveHoldingContext = ({
  children,
  moveItems,
  moveHoldings,
  leftInstance,
  rightInstance,
}) => {
  const intl = useIntl();
  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedHoldingsMap, setSelectedHoldingsMap] = useState([]);
  const [activeDropZone, setActiveDropZone] = useState();
  const [isMoveModalOpened, toggleMoveModal] = useState(false);
  const [movingItems, setMovingItems] = useState([]);
  const [dragToId, setDragToId] = useState();
  const [isHoldingMoved, setisHoldingMoved] = useState();
  const [movingTargetName, setMovingTargetName] = useState();

  const onConfirm = useCallback(() => {
    toggleMoveModal(false);
    setIsMoving(true);

    moveHoldings(dragToId, movingItems)
      .finally(() => {
        setIsMoving(false);
      });

    setSelectedHoldingsMap([]);
    setActiveDropZone(undefined);
  }, [movingItems, dragToId]);

  const onBeforeCapture = useCallback((result) => {
    const isHolding = result.draggableId.slice(0, 8) === 'holding-';

    setisHoldingMoved(isHolding);
  }, [selectedHoldingsMap]);

  const onDragStart = useCallback((result) => {
    setActiveDropZone(result.source.droppableId);
  }, [selectedHoldingsMap]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const from = result.source.droppableId;
    const to = result.destination.droppableId;
    const targetTitle = rightInstance.id === to ? rightInstance.title : leftInstance.title;
    setDragToId(to);
    setMovingTargetName(targetTitle);
    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = isHoldingMoved
      ? selectedHoldingsMap
      : Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    const itemDropId = isHoldingMoved ? result.draggableId.slice(8) : result.draggableId;

    if (!items.length) {
      items.push(itemDropId);
    }
    setMovingItems(items);

    if (isHoldingMoved) {
      toggleMoveModal(true);
    } else {
      setIsMoving(true);

      moveItems(to, items)
        .finally(() => {
          setIsMoving(false);
        });

      setSelectedHoldingsMap([]);
      setSelectedItemsMap((prevItemsMap) => ({
        ...prevItemsMap,
        [from]: undefined,
      }));
      setActiveDropZone(undefined);
    }
  }, [selectedItemsMap, selectedHoldingsMap, isHoldingMoved]);

  const getDraggingItems = useCallback(() => {
    const fromHolding = selectedItemsMap[activeDropZone] || {};

    return {
      items: Object.keys(fromHolding).filter(item => fromHolding[item]),
    };
  }, [activeDropZone, selectedItemsMap]);

  const isHoldingDragSelected = useCallback((holding) => {
    return selectedHoldingsMap.some(item => item === holding.id);
  }, [selectedHoldingsMap]);

  const selectHoldingsForDrag = useCallback((holding) => {
    setSelectedHoldingsMap((prevHoldings) => {
      const newHoldings = prevHoldings.filter(item => item !== holding.id);

      if (newHoldings.length < prevHoldings.length) {
        return [
          ...newHoldings,
        ];
      }
      return [
        ...newHoldings,
        holding.id
      ];
    });
  }, [setSelectedHoldingsMap]);

  const isItemsDragSelected = useCallback((items) => {
    return isItemsSelected(items, selectedItemsMap);
  }, [selectedItemsMap]);

  const selectItemsForDrag = useCallback((items) => {
    const holdingId = items[0].holdingsRecordId;

    setSelectedItemsMap((prevItemsMap) => {
      return selectItems(prevItemsMap, holdingId, items);
    });
  }, []);

  const closeModal = useCallback(() => {
    toggleMoveModal(false);
  }, [toggleMoveModal]);

  if (isMoving) {
    return <Loading size="large" />;
  }

  return (
    <>
      <DragDropContext
        onBeforeCapture={onBeforeCapture}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <DnDContext.Provider
          value={{
            activeDropZone,
            selectItemsForDrag,
            isItemsDragSelected,
            selectHoldingsForDrag,
            isHoldingDragSelected,
            getDraggingItems,
            draggingHoldingsCount: selectedHoldingsMap.length,
            isItemsDropable: !isHoldingMoved,
          }}
        >
          {children}
        </DnDContext.Provider>
      </DragDropContext>
      {isMoveModalOpened && (
        <ConfirmationModal
          id="move-holding-confirmation"
          confirmLabel={intl.formatMessage({ id: 'ui-inventory.moveItems.modal.confirmLabel' })}
          heading={intl.formatMessage({ id: 'ui-inventory.moveItems.modal.title' })}
          message={
            intl.formatMessage(
              { id: 'ui-inventory.moveItems.modal.message' },
              { 
                count: movingItems.length,
                targetName: <b>{movingTargetName}</b>
              }
            )
          }
          onCancel={closeModal}
          onConfirm={onConfirm}
          open
        />
      )}
    </>
  );
};

MoveHoldingContext.propTypes = {
  children: PropTypes.node.isRequired,
  moveItems: PropTypes.func.isRequired,
  moveHoldings: PropTypes.func.isRequired,
  leftInstance: PropTypes.object.isRequired, 
  rightInstance: PropTypes.object.isRequired,
};

export default MoveHoldingContext;
