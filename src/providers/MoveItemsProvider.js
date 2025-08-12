import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { isEmpty } from 'lodash';

import { MoveItemsContext } from '../contexts';
import * as RemoteStorage from '../RemoteStorageService';
import * as Move from '../Instance/Move';
import Confirmation from '../Instance/MoveItemsContext/Confirmation';
import { useConfirmationModal } from '../common';

const fixCursorSnapOffset = (args) => {
  // Bail out if keyboard activated
  if (!args.pointerCoordinates) {
    return rectIntersection(args);
  }
  const { x, y } = args.pointerCoordinates;
  const { width, height } = args.collisionRect;
  const updated = {
    ...args,
    // The collision rectangle is broken when using snapCenterToCursor. Reset
    // the collision rectangle based on pointer location and overlay size.
    collisionRect: {
      width,
      height,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
    },
  };
  return rectIntersection(updated);
};

const MoveItemsProvider = ({ children }) => {
  const confirmation = useConfirmationModal();

  const [isMoving, setIsMoving] = useState(false);
  const [holdingsWithItems, setHoldingsWithItems] = useState([]);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fromHolding, setFromHolding] = useState(null);
  const [toHolding, setToHolding] = useState(null);
  const [itemsToMove, setItemsToMove] = useState([]);

  const checkFromRemoteToNonRemote = RemoteStorage.Check.useByHoldings();
  const { moveItems, isMoving: isLoading } = Move.useItems();

  const getDraggingItems = (holdingId) => {
    return selectedItems.filter(item => {
      const holding = holdingsWithItems.find(h => h.items?.some(i => i.id === item.id));
      return holding?.id === holdingId;
    });
  };

  // Function to handle item selection
  const selectItemsForDrag = useCallback((items) => {
    setSelectedItems(prev => {
      const newSelected = [...prev];

      items.forEach(item => {
        const existingIndex = newSelected.findIndex(selected => selected.id === item.id);
        if (existingIndex >= 0) {
          newSelected.splice(existingIndex, 1);
        } else {
          newSelected.push(item);
        }
      });

      return newSelected;
    });
  }, []);

  // Function to handle all items selection
  const selectAllItemsForDrag = useCallback((items, e) => {
    setSelectedItems(prev => {
      const newSelected = [...prev];

      if (e.target?.checked) {
        // Add all items from this holding if they're not already selected
        items.forEach(item => {
          const existingIndex = newSelected.findIndex(selected => selected.id === item.id);
          if (existingIndex === -1) {
            newSelected.push(item);
          }
        });
      } else {
        // Remove all items from this holding
        const holdingId = items[0]?.holdingsRecordId;
        return newSelected.filter(selected => selected.holdingsRecordId !== holdingId);
      }

      return newSelected;
    });
  }, []);

  // Function to check if items are selected
  const isItemsDragSelected = useCallback((items) => {
    return items?.every(item => selectedItems.some(selected => selected.id === item.id));
  }, [selectedItems]);

  // Handle Escape key to clear selections
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedItems([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const findContainer = useCallback((
    containers,
    id
  ) => {
    // First check if the ID is a holding ID
    const holding = containers.find((hld) => hld.id === id);
    if (holding) {
      return holding.id;
    }

    // If not a holding, check if it's an item within any holding
    for (const hld of containers) {
      if (hld.items && hld.items.length > 0) {
        const item = hld.items.find((it) => it.id === id);

        if (item) {
          return hld.id;
        }
      }
    }

    return null;
  }, []);

  // Helper function to find which holding an item belongs to
  const findItemHolding = useCallback((itemId) => {
    return holdingsWithItems.find(holding => (
      holding.items?.some(hItem => hItem.id === itemId)
    ));
  }, [holdingsWithItems]);

  // Helper function to get selected items from a specific holding
  const getSelectedItemsFromHolding = useCallback((holdingId) => {
    return selectedItems.filter(item => {
      const itemHolding = findItemHolding(item.id);

      return itemHolding?.id === holdingId;
    });
  }, [selectedItems, findItemHolding]);

  // Helper function to handle dragging a single unselected item
  const handleSingleItemDrag = useCallback((itemId) => {
    setActiveDragItem(itemId);

    const itemToSelect = holdingsWithItems
      .flatMap(holding => holding.items || [])
      .find(item => item.id === itemId);

    setSelectedItems(itemToSelect ? [itemToSelect] : []);
  }, [holdingsWithItems]);

  // Helper function to determine which items should be moved
  const getItemsToMove = useCallback((activeId, activeHolding) => {
    if (selectedItems.some(item => item.id === activeId)) {
      // If dragging a selected item, move all selected items
      return selectedItems;
    } else {
      // If dragging an unselected item, move only that item
      const activeItem = activeHolding.items?.find((item) => item.id === activeId);

      return activeItem ? [activeItem] : [];
    }
  }, [selectedItems]);

  // Helper function to update holdings by moving items
  const updateHoldingsWithMovedItems = useCallback((prevHoldings, activeContainerId, overContainerId, draggableItems) => {
    return prevHoldings.map((holding) => {
      if (holding.id === activeContainerId) {
        // Remove items from source holding
        const itemIdsToRemove = draggableItems.map(item => item.id);
        return {
          ...holding,
          items: holding.items?.filter((item) => !itemIdsToRemove.includes(item.id)) || []
        };
      }
      if (holding.id === overContainerId) {
        // Add items to destination holding
        return {
          ...holding,
          items: [...(holding.items || []), ...draggableItems]
        };
      }
      return holding;
    });
  }, []);

  const setItemsState = (activeContainerId, overContainerId, draggableItems) => setHoldingsWithItems(prevState => updateHoldingsWithMovedItems(prevState, activeContainerId, overContainerId, draggableItems));

  // Function to revert items state when move operation is cancelled
  const revertItemsState = useCallback((fromHoldingId, toHoldingId, movedItemIds) => {
    setHoldingsWithItems(prevHoldings => {
      return prevHoldings.map((holding) => {
        if (holding.id === fromHoldingId) {
          // Return items back to the original holding
          const movedItemObjects = movedItemIds.map((itemId) => {
            // Find the item object from the destination holding
            const destHolding = prevHoldings.find(h => h.id === toHoldingId);
            return destHolding?.items?.find(item => item.id === itemId);
          }).filter(Boolean);

          return {
            ...holding,
            items: [...(holding.items || []), ...movedItemObjects]
          };
        }
        if (holding.id === toHoldingId) {
          // Remove items from destination holding
          return {
            ...holding,
            items: holding.items?.filter((item) => !movedItemIds.includes(item.id)) || []
          };
        }
        return holding;
      });
    });
  }, []);

  // Function to move items from one holding to another
  const moveItemsToHolding = useCallback(async (fromHoldingId, toHoldingId, itemsToMoveIds, { onSuccess, onReject } = {}) => {
    if (!fromHoldingId || !toHoldingId || fromHoldingId === toHoldingId) {
      return;
    }

    try {
      // Check if moving from remote to non-remote storage
      try {
        const check = checkFromRemoteToNonRemote({
          fromHoldingsId: fromHoldingId,
          toHoldingsId: toHoldingId,
        });
        if (check) await confirmation.wait();
      } catch {
        // User cancelled or check failed
        if (onReject) onReject();

        return;
      }

      // Call the actual move API
      await moveItems(fromHoldingId, toHoldingId, itemsToMoveIds);
      if (onSuccess) onSuccess();

      // Clear selections after successful move
      setSelectedItems([]);
      setItemsToMove([]);
    } catch (error) {
      console.error('Failed to move items:', error);
      // Revert the local state if the API call fails
      if (onReject) onReject();
    }
  }, [checkFromRemoteToNonRemote, confirmation, moveItems]);

  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;

    const activeContainerId = findContainer(holdingsWithItems, activeId);
    setFromHolding(activeContainerId);

    // Find which holding the dragged item belongs to
    const activeHoldingId = findContainer(holdingsWithItems, activeId);

    if (!activeHoldingId) return;

    // Check if the dragged item is already selected
    const isDraggedItemSelected = selectedItems.some(item => item.id === activeId);

    if (isDraggedItemSelected) {
      // Handle dragging selected items from the active holding
      const activeHoldingSelectedItems = getSelectedItemsFromHolding(activeHoldingId);

      if (activeHoldingSelectedItems.length > 0) {
        // Drag multiple selected items from the same holding
        setActiveDragItem('multiple');
        setSelectedItems(activeHoldingSelectedItems);
      } else {
        // No selected items in this holding, drag only the active item
        handleSingleItemDrag(activeId);
      }
    } else {
      // Handle dragging an unselected item
      handleSingleItemDrag(activeId);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    // Early validation - return if drag conditions aren't met
    const activeContainerId = findContainer(holdingsWithItems, active.id);
    const overContainerId = findContainer(holdingsWithItems, over?.id);

    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
      return;
    }

    // Update drag state
    setToHolding(overContainerId);

    // Update holdings with moved items
    setHoldingsWithItems(prevHoldings => {
      const activeHolding = prevHoldings.find(({ id }) => id === activeContainerId);
      const overHolding = prevHoldings.find(({ id }) => id === overContainerId);

      if (!activeHolding || !overHolding) {
        return prevHoldings;
      }

      // Determine which items to move
      const draggableItems = getItemsToMove(active.id, activeHolding);

      if (isEmpty(draggableItems)) {
        return prevHoldings;
      }

      setItemsToMove(draggableItems);

      // Update holdings by moving items
      return updateHoldingsWithMovedItems(prevHoldings, activeContainerId, overContainerId, draggableItems);
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!active || !over) {
      setActiveDragItem(null);
      return;
    }

    const movedItems = itemsToMove.map(({ id }) => id);
    const resetState = () => revertItemsState(fromHolding, toHolding, movedItems);

    await moveItemsToHolding(fromHolding, toHolding, movedItems, { onReject: resetState });

    // Reset drag state
    setActiveDragItem(null);
    setFromHolding(null);
    setToHolding(null);
  };

  return (
    <DndContext
      collisionDetection={fixCursorSnapOffset}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <MoveItemsContext.Provider value={{
        isMoving,
        setIsMoving,
        holdingsWithItems,
        setHoldingsWithItems,
        setItemsState,
        selectItemsForDrag,
        selectAllItemsForDrag,
        isItemsDragSelected,
        getDraggingItems,
        moveItemsToHolding,
        selectedItems,
        isLoading,
      }}
      >
        {children}
        {activeDragItem && createPortal(
          <DragOverlay modifiers={[snapCenterToCursor]}>
            <div style={{
              backgroundColor: '#333',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              fontSize: '14px',
              fontWeight: '600',
              border: '2px solid #007bff',
              width: 'auto',
              textAlign: 'center',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            >
              <FormattedMessage
                id="ui-inventory.moveItems.move.items.count"
                values={{ count: selectedItems.length || 1 }}
              />
            </div>
          </DragOverlay>,
          document.getElementById('ModuleContainer'),
        )}
      </MoveItemsContext.Provider>
      <Confirmation
        count={selectedItems.length}
        {...confirmation.props}
      />
    </DndContext>
  );
};

export default MoveItemsProvider;
