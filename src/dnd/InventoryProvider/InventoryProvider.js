import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export const InventoryStateContext = createContext(null);
export const InventoryActionsContext = createContext(null);

const initialState = {
  instances: {}, // {instId: { id, holdingIds: [] }}
  holdings: {}, // {holdingId: { id, instanceId, itemIds: [] }}
  items: {}, // {itemId: { id, holdingId, instanceId }}
  isMoving: false,
  __snapshot: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FROM_PANES': {
      const { leftInstance, rightInstance } = action.payload || {};
      const instances = {};
      const holdings = { ...state.holdings };

      [leftInstance, rightInstance].filter(Boolean).forEach((inst) => {
        instances[inst.id] = {
          ...inst,
          holdingIds: (inst.holdings || []).map(h => h.id),
        };

        (inst.holdings || []).forEach(hld => {
          const hid = hld.id;
          holdings[hid] = holdings[hid] || { id: hid, instanceId: inst.id, itemIds: [] };
        });
      });

      return { ...state, instances, holdings, items: {} };
    }

    // seed/merge holdings without items
    case 'SET_HOLDINGS': {
      const { holdings: holdingsPayload } = action.payload || {};
      const holdings = { ...(state.holdings || {}) };

      (holdingsPayload || []).forEach((h) => {
        if (!h || !h.id) return;

        const prev = holdings[h.id] || {};
        holdings[h.id] = {
          ...prev,
          ...h,
          id: h.id,
          instanceId: h.instanceId ?? prev.instanceId,
          itemIds: Array.isArray(prev.itemIds) ? prev.itemIds : [],
        };
      });

      return { ...state, holdings };
    }

    case 'SET_ITEMS_FOR_HOLDING': {
      const { holdingId, instanceId, itemsArr } = action.payload;
      if (!holdingId || !Array.isArray(itemsArr)) return state;

      const holdings = { ...(state.holdings || {}) };
      const items = { ...(state.items || {}) };

      const instId = instanceId ?? holdings[holdingId]?.instanceId ?? '';
      const itemIds = itemsArr.map(it => it.id);

      holdings[holdingId] = { ...(holdings[holdingId] || {}), itemIds };

      itemsArr.forEach(it => {
        const itemId = it.id;
        items[itemId] = { ...it, id: itemId, holdingId, instanceId: instId };
      });

      return { ...state, holdings, items };
    }

    case 'PREVIEW_START': {
      const { instances, holdings, items } = state;
      return { ...state, __snapshot: structuredClone({ instances, holdings, items }) };
    }

    case 'PREVIEW_MOVE_ITEMS': {
      if (!state.__snapshot) return state;
      return reducer(state, { type: 'MOVE_ITEMS', payload: action.payload });
    }

    case 'PREVIEW_MOVE_HOLDINGS': {
      if (!state.__snapshot) return state;
      return reducer(state, { type: 'MOVE_HOLDINGS', payload: action.payload });
    }

    case 'PREVIEW_REORDER_ITEMS': {
      if (!state.__snapshot) return state;
      return reducer(state, { type: 'REORDER_ITEMS', payload: action.payload });
    }

    case 'PREVIEW_CANCEL': {
      if (!state.__snapshot) return state;
      return { ...state, ...state.__snapshot, __snapshot: null };
    }

    case 'PREVIEW_COMMIT': {
      return state.__snapshot ? { ...state, __snapshot: null } : state;
    }

    case 'REORDER_ITEMS': {
      const { holdingId, itemIds } = action.payload || {};
      if (!holdingId || !Array.isArray(itemIds)) return state;
      return {
        ...state,
        holdings: {
          ...state.holdings,
          [holdingId]: {
            ...state.holdings[holdingId],
            itemIds,
          },
        },
      };
    }

    case 'MOVE_ITEM': {
      const { itemId, toHoldingId, toIndex } = action.payload || {};
      if (!itemId || !toHoldingId) return state;

      const item = state.items[itemId];
      const fromHoldingId = state.items[itemId]?.holdingId;
      const toHolding = state.holdings[toHoldingId];

      if (!fromHoldingId || !toHolding) return state;

      // Shallow copy containers we will mutate
      const next = {
        ...state,
        holdings: {
          ...state.holdings,
          [fromHoldingId]: { ...state.holdings[fromHoldingId] },
          [toHoldingId]: { ...state.holdings[toHoldingId] },
        },
        items: { ...state.items, [itemId]: { ...item } },
      };

      // remove item from source
      next.holdings[fromHoldingId].itemIds = next.holdings[fromHoldingId].itemIds.filter(id => id !== itemId);

      // insert to dest
      const dest = next.holdings[toHoldingId].itemIds.slice();
      const insertAt = typeof toIndex === 'number' ? toIndex : dest.length;
      dest.splice(insertAt, 0, itemId);
      next.holdings[toHoldingId].itemIds = dest;

      // update item refs
      next.items[itemId].holdingId = toHoldingId;
      next.items[itemId].instanceId = next.holdings[toHoldingId].instanceId;

      return next;
    }

    case 'MOVE_ITEMS': {
      const { itemIds, toHoldingId, toIndex } = action.payload || {};
      if (!Array.isArray(itemIds) || itemIds.length === 0 || !toHoldingId) return state;

      let next = state;
      const idx = toIndex;

      itemIds.forEach((id, k) => {
        next = reducer(next, {
          type: 'MOVE_ITEM',
          payload: { itemId: id, toHoldingId, toIndex: typeof idx === 'number' ? idx + k : undefined },
        });
      });

      return next;
    }

    case 'MOVE_HOLDING': {
      const { holdingId, toInstanceId, toIndex } = action.payload || {};
      const holding = state.holdings[holdingId];
      if (!holding || !state.instances[toInstanceId]) return state;

      const fromInstId = holding.instanceId;
      const next = {
        ...state,
        instances: {
          ...state.instances,
          [fromInstId]: { ...state.instances[fromInstId] },
          [toInstanceId]: { ...state.instances[toInstanceId] },
        },
        holdings: { ...state.holdings, [holdingId]: { ...holding, instanceId: toInstanceId } },
        items: { ...state.items },
      };

      // remove from old instance
      next.instances[fromInstId].holdingIds = next.instances[fromInstId].holdingIds.filter(id => id !== holdingId);

      // add to new instance
      const dest = next.instances[toInstanceId].holdingIds.slice();
      const insertAt = typeof toIndex === 'number' ? toIndex : dest.length;
      dest.splice(insertAt, 0, holdingId);
      next.instances[toInstanceId].holdingIds = dest;

      // cascade: update items.instanceId for items under this holding
      next.holdings[holdingId].itemIds.forEach((itId) => {
        next.items[itId] = { ...next.items[itId], instanceId: toInstanceId };
      });
      return next;
    }

    case 'MOVE_HOLDINGS': {
      const { holdingIds, toInstanceId, toIndex } = action.payload || {};
      if (!Array.isArray(holdingIds) || holdingIds.length === 0 || !toInstanceId) return state;

      let next = state;
      const idx = toIndex;

      holdingIds.forEach((id, k) => {
        next = reducer(next, {
          type: 'MOVE_HOLDING',
          payload: { holdingId: id, toInstanceId, toIndex: typeof idx === 'number' ? idx + k : undefined },
        });
      });

      return next;
    }

    default:
      return state;
  }
};

const InventoryProvider = ({
  children,
  leftInstance,
  rightInstance,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // initialize/refresh from panes
  useEffect(() => {
    dispatch({ type: 'SET_FROM_PANES', payload: { leftInstance, rightInstance } });
  }, [leftInstance, rightInstance]);

  const setItemsToHolding = useCallback((holdingId, instanceId, itemsArr) => {
    dispatch({ type: 'SET_ITEMS_FOR_HOLDING', payload: { holdingId, instanceId, itemsArr } });
  }, []);

  const setHoldings = useCallback((holdings) => {
    dispatch({ type: 'SET_HOLDINGS', payload: { holdings } });
  }, []);

  const actions = useMemo(() => ({
    moveItem: (opts) => dispatch({ type: 'MOVE_ITEM', payload: opts }),
    moveItems: (opts) => dispatch({ type: 'MOVE_ITEMS', payload: opts }),
    moveHolding: (opts) => dispatch({ type: 'MOVE_HOLDING', payload: opts }),
    reorderItems: (opts) => dispatch({ type: 'REORDER_ITEMS', payload: opts }),

    previewStart: () => dispatch({ type: 'PREVIEW_START' }),
    previewMoveItems: (opts) => dispatch({ type: 'PREVIEW_MOVE_ITEMS', payload: opts }),
    previewMoveHoldings: (opts) => dispatch({ type: 'PREVIEW_MOVE_HOLDINGS', payload: opts }),
    previewReorderItems: (opts) => dispatch({ type: 'PREVIEW_REORDER_ITEMS', payload: opts }),
    previewCancel:  () => dispatch({ type: 'PREVIEW_CANCEL' }),
    previewCommit:  () => dispatch({ type: 'PREVIEW_COMMIT' }),

    setHoldings,
    setItemsToHolding,
  }), []);
  return (
    <InventoryActionsContext.Provider value={actions}>
      <InventoryStateContext.Provider value={state}>
        {children}
      </InventoryStateContext.Provider>
    </InventoryActionsContext.Provider>
  );
};

export default InventoryProvider;

export const useInventoryState = () => {
  const ctx = useContext(InventoryStateContext);
  if (!ctx) throw new Error('useInventoryState must be used within InventoryProvider');
  return ctx;
};


export const useInventoryActions = () => {
  const ctx = useContext(InventoryActionsContext);
  if (!ctx) throw new Error('useInventoryActions must be used within InventoryProvider');
  return ctx;
};
