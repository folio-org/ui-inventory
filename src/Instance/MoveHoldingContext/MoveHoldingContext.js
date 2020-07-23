import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Loading,
  ConfirmationModal,
} from '@folio/stripes/components';
import DnDContext from '../../contexts/DnDContext';


const MoveHoldingContext = ({
  children,
  moveItems,
  moveHoldings,
  referenceData,
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedHoldingsMap, setSelectedHoldingsMap] = useState([]);
  const [activeDropZone, setActiveDropZone] = useState();
  const [isMoveModalOpened, toggleMoveModal] = useState(false);
  const [movingItems, setMovingItems] = useState([]);
  const [dragToId, setDragToId] = useState();

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

  const onDragStart = useCallback((result) => {
    setActiveDropZone(result.source.droppableId);
  }, []);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const from = result.source.droppableId;
    const to = result.destination.droppableId;
    setDragToId(to);
    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = selectedHoldingsMap.length
      ?
      selectedHoldingsMap
      :
      Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    if (!items.length) {
      items.push(result.draggableId);
    }
    setMovingItems(items);

    if (selectedHoldingsMap.length) {
      toggleMoveModal(true);
    } else {
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
    }
  }, [selectedItemsMap, selectedHoldingsMap]);

  const getDraggingItems = useCallback(() => {
    const fromHolding = selectedItemsMap[activeDropZone] || {};

    return {
      items: Object.keys(fromHolding).filter(item => fromHolding[item]),
    };
  }, [activeDropZone, selectedItemsMap]);

  const ifHoldingDragSelected = useCallback((holding) => {
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

  const closeModal = useCallback(() => {
    toggleMoveModal(false);
  }, [toggleMoveModal]);

  if (isMoving) {
    return <Loading size="large" />;
  }

  return (
    <>
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <DnDContext.Provider
          value={{
            activeDropZone,
            selectItemsForDrag,
            ifItemsDragSelected,
            selectHoldingsForDrag,
            ifHoldingDragSelected,
            getDraggingItems,
            draggingHoldingsCount: selectedHoldingsMap.length,
            referenceData,
            isItemsDropable: !selectedHoldingsMap.length,
          }}
        >
          {children}
        </DnDContext.Provider>
      </DragDropContext>
      {isMoveModalOpened && (
        <ConfirmationModal
          id="delete-row-confirmation"
          confirmLabel={<FormattedMessage id="ui-inventory.moveItems.modal.confirmLabel" />}
          heading={<FormattedMessage id="ui-inventory.moveItems.modal.title" />}
          message={
            <FormattedMessage
              id="ui-inventory.moveItems.modal.message"
              values={{
                count: movingItems.length,
              }}
            />
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
  referenceData: PropTypes.object,
};

export default MoveHoldingContext;
