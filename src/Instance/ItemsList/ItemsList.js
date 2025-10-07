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

import { itemStatuses } from '@folio/stripes-inventory-components';
import {
  Icon,
  MCLPagingTypes,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import ItemRow from './ItemRow';
import ItemBarcode from './ItemBarcode';
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

const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });

const getFormatter = (
  intl,
  holdingId,
  locationsById,
  holdingsMapById,
  isBarcodeAsHotlink,
  isFetching,
  tenantId,
) => ({
  'order': (item) => item.order || <NoValue />,
  'barcode': item => {
    return (
      item.id && (
        <>
          <ItemBarcode
            item={item}
            holdingId={item.holdingsRecordId}
            instanceId={holdingsMapById[item.holdingsRecordId]?.instanceId}
            isBarcodeAsHotlink={isBarcodeAsHotlink && !isFetching}
            tenantId={tenantId}
          />
          {item.discoverySuppress &&
            <span>
              <Icon
                size="medium"
                icon="exclamation-circle"
                status="warn"
              />
            </span>
          }
        </>)
    ) || <NoValue />;
  },
  'status': x => {
    if (!x.status?.name) return <NoValue />;

    const statusName = x.status.name;
    const itemStatusTranslationId = itemStatuses.find(({ value }) => value === statusName)?.label;

    return itemStatusTranslationId ? intl.formatMessage({ id: itemStatusTranslationId }) : statusName;
  },
  'copyNumber': ({ copyNumber }) => copyNumber || <NoValue />,
  'loanType': x => x.temporaryLoanType?.name || x.permanentLoanType?.name || <NoValue />,
  'effectiveLocation': x => {
    const effectiveLocation = locationsById[x.effectiveLocation?.id];
    return effectiveLocation?.isActive ?
      effectiveLocation?.name || <NoValue /> :
      intl.formatMessage(
        { id: 'ui-inventory.inactive.gridCell' },
        { location: effectiveLocation?.name }
      );
  },
  'enumeration': x => x.enumeration || <NoValue />,
  'chronology': x => x.chronology || <NoValue />,
  'volume': x => x.volume || <NoValue />,
  'yearCaption': x => x.yearCaption?.join(', ') || <NoValue />,
  'materialType': x => x.materialType?.name || <NoValue />,
});

const getColumnMapping = (intl) => ({
  'order': intl.formatMessage({ id: 'ui-inventory.item.order' }),
  'barcode': intl.formatMessage({ id: 'ui-inventory.item.barcode' }),
  'status': intl.formatMessage({ id: 'ui-inventory.status' }),
  'copyNumber': intl.formatMessage({ id: 'ui-inventory.copyNumber' }),
  'loanType': intl.formatMessage({ id: 'ui-inventory.loanType' }),
  'effectiveLocation': intl.formatMessage({ id: 'ui-inventory.effectiveLocationShort' }),
  'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
  'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
  'volume': intl.formatMessage({ id: 'ui-inventory.volume' }),
  'yearCaption': intl.formatMessage({ id: 'ui-inventory.yearCaption' }),
  'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
});

const visibleColumns = draggableVisibleColumns.filter(col => !['dnd', 'select'].some(it => col === it));
const columnWidths = { order: '80px', select: '60px', barcode: '160px' };
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
  const searchParams = {
    sortBy: sortByQuery,
    limit: 200,
    offset,
  };

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
    manualOrderChanges,
    initializeOriginalOrders,
  } = useOrderManagement({ holdingId: holding.id, tenantId });

  // Register order management functions with context
  useEffect(() => {
    registerOrderManagement({
      applyOrderChanges,
      resetOrderChanges,
      hasPendingChanges,
    });
  }, [registerOrderManagement, applyOrderChanges, resetOrderChanges, hasPendingChanges]);

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
      initializeOriginalOrders();
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
        changedOrdersMap: manualOrderChanges,
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
    [isItemsMovement, holdingsMapById, selectItemForDrag, ifItemsSelected, handleOrderChange, validationErrors, manualOrderChanges],
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
      visibleColumns={isItemsMovement ? draggableVisibleColumns : visibleColumns}
      columnMapping={columnMapping}
      ariaLabel={ariaLabel}
      interactive={false}
      onNeedMoreData={onNeedMoreData}
      columnWidths={columnWidths}
      pagingType={MCLPagingTypes.PREV_NEXT}
      totalCount={total}
      nonInteractiveHeaders={isItemsMovement ? visibleColumns : ['loanType', 'effectiveLocation', 'materialType']}
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
