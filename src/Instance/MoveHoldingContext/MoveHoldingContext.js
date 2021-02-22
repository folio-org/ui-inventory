import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
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
import { DataContext } from '../../contexts';
import DnDContext from '../DnDContext';
import {
  isItemsSelected,
  selectItems,
} from '../utils';
import {
  callNumberLabel
} from '../../utils';

const MoveHoldingContext = ({
  children,
  moveItems,
  moveHoldings,
  leftInstance,
  rightInstance,
}) => {
  const intl = useIntl();
  const { locationsById } = useContext(DataContext);

  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedHoldingsMap, setSelectedHoldingsMap] = useState([]);
  const [activeDropZone, setActiveDropZone] = useState();
  const [isMoveModalOpened, toggleMoveModal] = useState(false);
  const [movingItems, setMovingItems] = useState([]);
  const [dragToId, setDragToId] = useState();
  const [dragFromId, setDragFromId] = useState();
  const [isHoldingMoved, setisHoldingMoved] = useState();
  const [allHoldings, setAllHoldings] = useState([]);

  const onConfirm = useCallback(() => {
    toggleMoveModal(false);
    setIsMoving(true);

    const movingPromise = isHoldingMoved
      ? moveHoldings(dragToId, movingItems)
      : moveItems(dragToId, movingItems);

    movingPromise.finally(() => {
      setIsMoving(false);
    });

    setSelectedItemsMap((prevItemsMap) => ({
      ...prevItemsMap,
      [dragFromId]: undefined,
    }));
    setSelectedHoldingsMap([]);
    setActiveDropZone(undefined);
    setAllHoldings([]);
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
    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = isHoldingMoved
      ? selectedHoldingsMap
      : Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);
    const itemDropId = isHoldingMoved ? result.draggableId.slice(8) : result.draggableId;

    setDragToId(to);
    setDragFromId(from);

    if (!items.length) {
      items.push(itemDropId);
    }
    setMovingItems(items);
    toggleMoveModal(true);
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

  const onSelect = useCallback(({ target }) => {
    const to = target.dataset.toId;
    const from = target.dataset.itemId;
    const isHolding = target.dataset.isHolding;
    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = isHolding
      ? selectedHoldingsMap
      : Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    setisHoldingMoved(isHolding);
    setDragToId(to);
    setDragFromId(from);

    if (!items.length) {
      items.push(from);
    }
    setMovingItems(items);
    toggleMoveModal(true);
  }, [selectedHoldingsMap, selectedItemsMap]);

  const movingMessage = useMemo(() => {
    const targetHolding = allHoldings.filter(item => item.id === dragToId);
    const callNumber = callNumberLabel(targetHolding[0]);
    const labelLocation = targetHolding[0]?.permanentLocationId ? locationsById[targetHolding[0].permanentLocationId].name : '';

    if (isHoldingMoved) {
      return intl.formatMessage(
        { id: 'ui-inventory.moveItems.modal.message.holdings' },
        {
          count: movingItems.length,
          targetName: <b>{rightInstance.id === dragToId ? rightInstance.title : leftInstance.title}</b>
        }
      );
    } else {
      return intl.formatMessage(
        { id: 'ui-inventory.moveItems.modal.message.items' },
        {
          count: movingItems.length,
          targetName: <b>{`${labelLocation} ${callNumber}`}</b>
        }
      );
    }
  }, [allHoldings, movingItems, isHoldingMoved]);

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
            isItemsDroppable: !isHoldingMoved,
            instances: [
              rightInstance,
              leftInstance,
            ],
            selectedItemsMap,
            setAllHoldings,
            allHoldings,
            onSelect,
            selectedHoldingsMap,
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
          message={movingMessage}
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
