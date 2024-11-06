import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import {
  Loading,
  MessageBanner,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { LINES_API, LIMIT_MAX } from '@folio/stripes-acq-components';

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
import { HoldingContainer } from '../HoldingsList';
import * as Move from '../Move';
import { getPOLineHoldingIds } from './utils';

const MoveHoldingContext = ({
  children,
  moveHoldings,
  leftInstance,
  rightInstance,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const { locationsById } = useContext(DataContext);
  const { holdingsById } = useHoldings();

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();
  const { moveItems, isMoving: isItemsMoving } = Move.useItems();

  const [isMoving, setIsMoving] = useState(false);
  const [selectedItemsMap, setSelectedItemsMap] = useState({});
  const [selectedHoldingsMap, setSelectedHoldingsMap] = useState([]);
  const [activeDropZone, setActiveDropZone] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movingItems, setMovingItems] = useState([]);
  const [dragToId, setDragToId] = useState();
  const [dragFromId, setDragFromId] = useState();
  const [isHoldingMoved, setIsHoldingMoved] = useState();
  const [hasLinkedPOLsOrHoldings, setHasLinkedPOLsOrHoldings] = useState(false);
  const [selectedHoldingIds, setSelectedHoldingIds] = useState([]);

  const {
    holdingsRecords: leftHoldings,
    refetch: refetchLeftHolding
  } = useInstanceHoldingsQuery(leftInstance.id, { refreshKey: !isMoving });
  const {
    holdingsRecords: rightHoldings,
    refetch: refetchRightHolding,
  } = useInstanceHoldingsQuery(rightInstance.id, { refreshKey: !isMoving });

  const allHoldings = useMemo(() => [
    ...(leftHoldings ?? []),
    ...(rightHoldings ?? [])
  ], [leftHoldings, rightHoldings]);

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

    setSelectedHoldingIds([]);
    refetchLeftHolding();
    refetchRightHolding();
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

  const checkHasMultiplePOLsOrHoldings = async (holdingIds = []) => {
    if (isEmpty(holdingIds)) {
      return {
        hasLinkedPOLs: false,
        poLineHoldingIds: [],
      };
    }

    try {
      const { poLines = [] } = await ky.get(LINES_API, {
        searchParams: {
          query: holdingIds.map(id => `locations=="*${id}*"`).join(' or '),
          limit: LIMIT_MAX,
        }
      }).json();

      return {
        hasLinkedPOLs: poLines.length > 1 || poLines[0]?.locations?.length > 1,
        poLineHoldingIds: getPOLineHoldingIds(poLines, holdingIds),
      };
    } catch (error) {
      return {
        hasLinkedPOLs: false,
        poLineHoldingIds: [],
      };
    }
  };

  const onSelect = useCallback(async ({ target }) => {
    const to = target.dataset.toId;
    const from = target.dataset.itemId;
    const isHolding = target.dataset.isHolding;
    const fromSelectedMap = selectedItemsMap[from] || {};
    const selectedInstanceHoldings = leftInstance.id === to ? rightHoldings : leftHoldings;
    const selectedInstanceHoldingsIds = selectedInstanceHoldings.map(i => i.id);

    const items = isHolding
      ? selectedHoldingsMap
      : Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

    setIsHoldingMoved(isHolding);
    setDragToId(to);
    setDragFromId(from);

    const holdingIds = [...new Set([...items, from])];

    const holdingIdsFromSelection = selectedInstanceHoldingsIds.filter(holdingId => holdingIds.includes(holdingId));

    const {
      hasLinkedPOLs,
      poLineHoldingIds
    } = await checkHasMultiplePOLsOrHoldings(holdingIdsFromSelection);

    const holdingIdsToMove = uniq([...poLineHoldingIds, ...holdingIdsFromSelection]);

    setMovingItems(isHolding || hasLinkedPOLs ? holdingIdsToMove : items);
    setHasLinkedPOLsOrHoldings(hasLinkedPOLs);
    setSelectedHoldingIds(holdingIdsToMove);
    setIsModalOpen(true);
  }, [selectedItemsMap, leftInstance, rightHoldings, leftHoldings, selectedHoldingsMap, checkHasMultiplePOLsOrHoldings]);

  const movingMessage = useMemo(
    () => {
      const targetHolding = holdingsById[dragToId];
      const callNumber = callNumberLabel(targetHolding);
      const labelLocation = targetHolding?.permanentLocationId ? locationsById[targetHolding.permanentLocationId]?.name : '';
      const holdings = allHoldings.filter(holding => selectedHoldingIds.includes(holding.id));

      const count = movingItems.length;

      if (hasLinkedPOLsOrHoldings) {
        return (
          <>
            { intl.formatMessage(
              { id: 'ui-inventory.moveItems.modal.message.hasLinkedPOLsOrHoldings' },
            )}
            {
              selectedHoldingIds.map(holdingId => (
                <HoldingContainer
                  key={holdingId}
                  holding={allHoldings.find(holding => holding.id === holdingId)}
                  holdings={holdings}
                  isDraggable={false}
                  instance={rightInstance.id === dragToId ? rightInstance : leftInstance}
                />
              ))
            }
          </>
        );
      }

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
      leftInstance.title,
      allHoldings,
      selectedHoldingIds,
    ],
  );

  if (isMoving || isItemsMoving) {
    return <Loading size="large" />;
  }

  return (
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
        <Move.ConfirmationModal
          id="move-holding-confirmation"
          message={movingMessage}
          onCancel={closeModal}
          onConfirm={onConfirm}
          open={isModalOpen}
        />
      </DnDContext.Provider>
    </DragDropContext>
  );
};

MoveHoldingContext.propTypes = {
  children: PropTypes.node.isRequired,
  moveHoldings: PropTypes.func.isRequired,
  leftInstance: PropTypes.object.isRequired,
  rightInstance: PropTypes.object.isRequired,
};

export default MoveHoldingContext;
