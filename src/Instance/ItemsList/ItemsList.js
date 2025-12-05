import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { keyBy } from 'lodash';

import {
  MCLPagingTypes,
  MultiColumnList,
} from '@folio/stripes/components';

import ItemRow from './ItemRow';
import DraggableItemsList, {
  draggableVisibleColumns,
  getDraggableColumnMapping,
  getDraggableFormatter,
} from './DraggableItemsList';

import {
  useSelection,
  useInventoryActions,
  useInventoryState,
} from '../../dnd';
import {
  useHoldingItemsQuery,
  useOrderManagement,
} from '../../hooks';
import { OrderManagementContext } from '../../contexts';
import useReferenceData from '../../hooks/useReferenceData';
import useBoundWithHoldings from '../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';

import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  ITEM_TABLE_PAGE_AMOUNT,
} from '../../constants';
import {
  getColumnMapping,
  getColumnWidths,
  getFormatter,
  getTableAria,
  getVisibleColumns,
} from './utils';

const rowMetadata = ['id', 'holdingsRecordId'];

const ItemsList = ({
  id,
  instanceId,
  holding,
  tenantId,
  isBarcodeAsHotlink,
  isItemsMovement = false,
}) => {
  const intl = useIntl();

  const state = useInventoryState();
  const actions = useInventoryActions();

  const {
    toggleItem: selectItemForDrag,
    toggleAllItems: selectAllItemsForDrag,
    isItemsDragSelected: ifItemsSelected,
  } = useSelection();

  const [offset, setOffset] = useState(0);
  const [sortByQuery, setSortByQuery] = useState(DEFAULT_ITEM_TABLE_SORTBY_FIELD);
  const searchParams = useMemo(() => ({
    sortBy: isItemsMovement ? 'order' : sortByQuery,
    limit: 200,
    offset,
  }), [isItemsMovement, sortByQuery]);

  const { items, isFetching } = useHoldingItemsQuery(holding.id, { searchParams, key: 'items', tenantId });
  const { totalRecords: total = 0 } = useHoldingItemsQuery(holding.id, { searchParams: { limit: 0 }, key: 'itemCount', tenantId });
  const { boundWithHoldings: holdings } = useBoundWithHoldings(items, tenantId);
  const { registerOrderManagement } = useContext(OrderManagementContext);

  const {
    handleOrderChange,
    applyOrderChanges,
    resetOrderChanges,
    hasPendingChanges,
    validationErrors,
    dirtyItemsMap,
    initializeOriginalOrders,
    updateOriginalOrders,
    handleDndReorder,
  } = useOrderManagement({ holdingId: holding.id, tenantId });

  // Register order management functions with context
  useEffect(() => {
    registerOrderManagement(holding.id, {
      applyOrderChanges,
      resetOrderChanges,
      hasPendingChanges,
      updateOriginalOrders,
      handleDndReorder,
    });
  }, [registerOrderManagement, holding.id, applyOrderChanges, resetOrderChanges, hasPendingChanges, updateOriginalOrders, handleDndReorder]);

  const contentData = useMemo(
    () => state.holdings[holding?.id]?.itemIds.map(itemId => state.items[itemId]) || [],
    [state.holdings, state.items],
  );
  const holdingsMapById = keyBy(holdings, 'id');

  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  });

  useEffect(() => {
    if (items?.length && !isFetching) {
      actions.setItemsToHolding(holding.id, instanceId, items);
      // Initialize original orders when items are loaded
      initializeOriginalOrders(items);
    }
  }, [items, isFetching]);

  const { locationsById } = useReferenceData();
  const pagingCanGoPrevious = offset > 0;
  const pagingCanGoNext = offset < total && total - offset > ITEM_TABLE_PAGE_AMOUNT;

  const ariaLabel = useMemo(() => getTableAria(intl), []);
  const columnMapping = useMemo(
    () => {
      const draggableColMapping = getDraggableColumnMapping({
        intl,
        items: contentData,
        holdingsRecordId: holding.id,
        ifItemsSelected,
        selectAllItemsForDrag,
        isFetching,
      });
      const colMapping = getColumnMapping(intl);

      return {
        ...colMapping,
        ...(isItemsMovement ? draggableColMapping : {}),
      };
    },
    [isItemsMovement, holding.id, contentData, ifItemsSelected, selectAllItemsForDrag],
  );
  const formatter = useMemo(
    () => {
      const dndFormatter = getDraggableFormatter({
        holdingId: id,
        selectItemForDrag,
        ifItemsSelected,
        onOrderChange: handleOrderChange,
        validationErrors,
        changedOrdersMap: dirtyItemsMap,
        isFetching,
      });
      const f = getFormatter(
        intl,
        id,
        locationsById,
        holdingsMapById,
        isBarcodeAsHotlink,
        isFetching,
        tenantId,
      );

      return {
        ...f,
        ...(isItemsMovement ? dndFormatter : {}),
      };
    },
    [isItemsMovement, holdingsMapById, selectItemForDrag, ifItemsSelected, handleOrderChange, validationErrors, dirtyItemsMap],
  );
  const onNeedMoreData = (askAmount, _index, _firstIndex, direction) => {
    const amount = (direction === 'next') ? askAmount : -askAmount;
    setOffset(offset + amount);
  };

  // NOTE: in order to sort on a particular column, it must be registered
  // as a sorter in '../utils'. If it's not, there won't be any errors;
  // sorting on that column simply won't work.
  const onHeaderClick = useCallback((e, { name: column }) => {
    if (['dnd', 'select'].includes(column) || isItemsMovement) return;

    const isChangeDirection = itemsSorting.column === column;

    const newItemsSorting = {
      column: isChangeDirection ? itemsSorting.column : column,
      isDesc: isChangeDirection ? !itemsSorting.isDesc : true,
    };

    setItemsSorting(newItemsSorting);
    setSortByQuery(`${newItemsSorting.isDesc ? '-' : ''}${newItemsSorting.column}`);
  }, [itemsSorting]);

  const visibleColumns = useMemo(
    () => (isItemsMovement ? draggableVisibleColumns : getVisibleColumns()),
    [isItemsMovement, draggableVisibleColumns],
  );
  const nonInteractiveHeaders = useMemo(
    () => (isItemsMovement ? getVisibleColumns() : ['loanType', 'effectiveLocation', 'materialType']),
    [isItemsMovement],
  );

  const renderFormatter = (props) => {
    return (
      <ItemRow
        draggable={isItemsMovement}
        holdingId={holding.id}
        {...props}
      />
    );
  };

  const itemsListElement = (
    <MultiColumnList
      id={`list-items-${holding.id}`}
      columnIdPrefix={`list-items-${holding.id}`}
      contentData={contentData}
      rowMetadata={rowMetadata}
      formatter={formatter}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      ariaLabel={ariaLabel}
      interactive={false}
      onNeedMoreData={onNeedMoreData}
      columnWidths={getColumnWidths()}
      pagingType={MCLPagingTypes.PREV_NEXT}
      totalCount={total}
      nonInteractiveHeaders={nonInteractiveHeaders}
      onHeaderClick={onHeaderClick}
      sortDirection={itemsSorting.isDesc ? 'descending' : 'ascending'}
      sortedColumn={itemsSorting.column}
      rowFormatter={renderFormatter}
      pageAmount={ITEM_TABLE_PAGE_AMOUNT}
      pagingCanGoPrevious={pagingCanGoPrevious}
      pagingCanGoNext={pagingCanGoNext}
      pagingOffset={offset}
      loading={isFetching}
    />
  );

  if (isItemsMovement) {
    return (
      <DraggableItemsList
        itemId={id}
        isItemsMovement={isItemsMovement}
        holding={holding}
        contentData={contentData}
        isFetching={isFetching}
      >
        {itemsListElement}
      </DraggableItemsList>
    );
  }

  return itemsListElement;
};

ItemsList.propTypes = {
  id: PropTypes.string,
  instanceId: PropTypes.string.isRequired,
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  isBarcodeAsHotlink: PropTypes.bool,
  isItemsMovement: PropTypes.bool,
};

export default ItemsList;
