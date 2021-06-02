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
  MessageBanner,
} from '@folio/stripes/components';

import {
  callNumberLabel
} from '../../utils';
import { DataContext } from '../../contexts';
import { useHoldings, useInstanceHoldingsQuery } from '../../providers';
import * as RemoteStorage from '../../RemoteStorageService';

import {
  isItemsSelected,
  selectItems,
} from '../utils';
import DnDContext from '../DnDContext';
import * as Move from '../Move';


const MoveHoldingContext = ({
  children,
  moveHoldings,
  leftInstance,
  rightInstance,
}) => {
  const intl = useIntl();

  const { locationsById } = useContext(DataContext);

  const { holdingsById } = useHoldings();

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();
  const { moveItems, isMoving: isItemsMoving } = Move.useItems();

  const { holdingsRecords: leftHoldings } = useInstanceHoldingsQuery(leftInstance.id);
  const { holdingsRecords: rightHoldings } = useInstanceHoldingsQuery(rightInstance.id);
  const allHoldings = [...(leftHoldings ?? []), ...(rightHoldings ?? [])];

  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedHoldingsMap, setSelectedHoldingsMap] = useState([]);
  const [activeDropZone, setActiveDropZone] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movingItems, setMovingItems] = useState([]);
  const [dragToId, setDragToId] = useState();
  const [dragFromId, setDragFromId] = useState();
  const [isHoldingMoved, setIsHoldingMoved] = useState();

  const onConfirm = useCallback(() => {
    setIsModalOpen(false);

    if (isHoldingMoved) {
      setIsMoving(true);
      moveHoldings(dragToId, movingItems)
        .finally(() => { setIsMoving(false); });
    } else {
      moveItems(dragFromId, dragToId, movingItems);
    }

    setSelectedItemsMap((prevItemsMap) => ({
      ...prevItemsMap,
      [dragFromId]: undefined,
    }));
    setSelectedHoldingsMap([]);
    setActiveDropZone(undefined);
  }, [movingItems, dragToId]);

  const onBeforeCapture = useCallback((result) => {
    const isHolding = result.draggableId.slice(0, 8) === 'holding-';

    setIsHoldingMoved(isHolding);
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
    setIsModalOpen(true);
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
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const onSelect = useCallback(({ target }) => {
    const to = target.dataset.toId;
    const from = target.dataset.itemId;
    const isHolding = target.dataset.isHolding;
    const fromSelectedMap = selectedItemsMap[from] || {};
    const items = isHolding
      ? selectedHoldingsMap
      : Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    setIsHoldingMoved(isHolding);
    setDragToId(to);
    setDragFromId(from);

    if (!items.length) {
      items.push(from);
    }
    setMovingItems(items);
    setIsModalOpen(true);
  }, [selectedHoldingsMap, selectedItemsMap]);

  const movingMessage = useMemo(
    () => {
      const targetHolding = holdingsById[dragToId];
      const callNumber = callNumberLabel(targetHolding);
      const labelLocation = targetHolding?.permanentLocationId ? locationsById[targetHolding.permanentLocationId].name : '';

      const count = movingItems.length;

      if (isHoldingMoved) {
        return intl.formatMessage(
          { id: 'ui-inventory.moveItems.modal.message.holdings' },
          {
            count,
            targetName: <b>{rightInstance.id === dragToId ? rightInstance.title : leftInstance.title}</b>
          }
        );
      }

      const moveMsg = intl.formatMessage(
        { id: 'ui-inventory.moveItems.modal.message.items' },
        {
          count,
          targetName: <b>{`${labelLocation} ${callNumber}`}</b>
        }
      );

      return (
        <>
          {moveMsg}
          <MessageBanner
            show={checkFromRemoteToNonRemote({ fromHoldingsId: dragFromId, toHoldingsId: dragToId })}
            type="warning"
          >
            <RemoteStorage.Confirmation.Message count={count} />
          </MessageBanner>
        </>
      );
    },
    [
      holdingsById,
      dragToId,
      locationsById,
      movingItems.length,
      isHoldingMoved,
      intl,
      checkFromRemoteToNonRemote,
      dragFromId,
      rightInstance.id,
      rightInstance.title,
      leftInstance.title
    ],
  );

  if (isMoving || isItemsMoving) {
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
            allHoldings,
            onSelect,
            selectedHoldingsMap,
          }}
        >
          {children}
        </DnDContext.Provider>
      </DragDropContext>
      <Move.ConfirmationModal
        id="move-holding-confirmation"
        message={movingMessage}
        onCancel={closeModal}
        onConfirm={onConfirm}
        open={isModalOpen}
      />
    </>
  );
};

MoveHoldingContext.propTypes = {
  children: PropTypes.node.isRequired,
  moveHoldings: PropTypes.func.isRequired,
  leftInstance: PropTypes.object.isRequired,
  rightInstance: PropTypes.object.isRequired,
};

export default MoveHoldingContext;
