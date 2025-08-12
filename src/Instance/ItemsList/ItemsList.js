import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { keyBy } from 'lodash';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { itemStatuses } from '@folio/stripes-inventory-components';
import {
  Checkbox,
  Icon,
  Loading,
  MCLPagingTypes,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import ItemRow from './ItemRow';
import DraggableHandle from './DraggableHandle';
import ItemBarcode from './ItemBarcode';

import { useHoldingItemsQuery } from '../../hooks';
import useReferenceData from '../../hooks/useReferenceData';
import useBoundWithHoldings from '../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';
import { useMoveItemsContext } from '../../contexts';

import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  ITEM_TABLE_PAGE_AMOUNT,
} from '../../constants';

const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });

const getFormatter = (
  intl,
  locationsById,
  holdingsMapById,
  selectItemsForDrag = () => {},
  ifItemsSelected = () => {},
  isBarcodeAsHotlink,
  tenantId,
) => ({
  'dnd': (item) => (
    <DraggableHandle itemId={item.id} />
  ),
  'order': (item) => item.order || <NoValue />,
  'select': (item) => (
    <FormattedMessage id="ui-inventory.moveItems.selectItem">
      {
        ([ariaLabel]) => (
          <span data-test-select-item>
            <Checkbox
              id={`select-item-${item.id}`}
              aria-label={ariaLabel}
              checked={ifItemsSelected([item])}
              onChange={() => selectItemsForDrag([item])}
            />
          </span>
        )
      }
    </FormattedMessage>
  ),
  'barcode': item => {
    return (
      item.id && (
        <>
          <ItemBarcode
            item={item}
            holdingId={item.holdingsRecordId}
            instanceId={holdingsMapById[item.holdingsRecordId]?.instanceId}
            isBarcodeAsHotlink={isBarcodeAsHotlink}
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

const getColumnMapping = (intl, holdingsRecordId, items, ifItemsSelected = () => {}, selectAllItemsForDrag = () => {}) => ({
  'dnd': '',
  'order': intl.formatMessage({ id: 'ui-inventory.item.order' }),
  'select': (
    <span data-test-select-all-items>
      <Checkbox
        id={`select-all-items-${holdingsRecordId}`}
        aria-label={intl.formatMessage({ id: 'ui-inventory.moveItems.selectAll' })}
        checked={ifItemsSelected(items)}
        onChange={(e) => selectAllItemsForDrag(items, e)}
      />
    </span>
  ),
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

const visibleColumns = [
  'order',
  'barcode',
  'status',
  'copyNumber',
  'loanType',
  'effectiveLocation',
  'enumeration',
  'chronology',
  'volume',
  'yearCaption',
  'materialType',
];
const columnWidths = { order: '60px', select: '60px', barcode: '160px' };
const dragVisibleColumns = ['dnd', visibleColumns[0], 'select', ...visibleColumns.slice(1)];
const rowMetadata = ['id', 'holdingsRecordId'];

const ItemsList = ({
  contentData,
  holding,
  tenantId,
  setItemsToHolding,
  isBarcodeAsHotlink,
  id,
}) => {
  const intl = useIntl();

  const {
    isMoving,
    isLoading,
    selectItemsForDrag,
    isItemsDragSelected,
    selectAllItemsForDrag,
  } = useMoveItemsContext();
  const { setNodeRef } = useDroppable({ id, disabled: !isMoving });

  const [offset, setOffset] = useState(0);
  const [sortByQuery, setSortByQuery] = useState(DEFAULT_ITEM_TABLE_SORTBY_FIELD);
  const searchParams = {
    sortBy: sortByQuery,
    limit: 200,
    offset,
  };

  const { items, isFetching } = useHoldingItemsQuery(holding.id, { searchParams, tenantId });
  const { totalRecords: total } = useHoldingItemsQuery(holding.id, { searchParams: { limit: 0 }, key: 'itemCount', tenantId });
  const { boundWithHoldings: holdings } = useBoundWithHoldings(items, tenantId);

  const holdingsMapById = keyBy(holdings, 'id');

  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  });

  useEffect(() => {
    if (items?.length && !isFetching) {
      setItemsToHolding(holding.id, items);
    }
  }, [items, isFetching]);

  const { locationsById } = useReferenceData();
  const pagingCanGoPrevious = offset > 0;
  const pagingCanGoNext = offset < total && total - offset > ITEM_TABLE_PAGE_AMOUNT;

  const ariaLabel = useMemo(() => getTableAria(intl), []);
  const columnMapping = useMemo(
    () => getColumnMapping(intl, holding.id, contentData, isItemsDragSelected, selectAllItemsForDrag),
    [holding.id, contentData, isItemsDragSelected, selectAllItemsForDrag],
  );
  const formatter = useMemo(
    () => getFormatter(
      intl,
      locationsById,
      holdingsMapById,
      selectItemsForDrag,
      isItemsDragSelected,
      isBarcodeAsHotlink,
      tenantId,
    ),
    [holdingsMapById, selectItemsForDrag, isItemsDragSelected],
  );
  const onNeedMoreData = (askAmount, _index, _firstIndex, direction) => {
    const amount = (direction === 'next') ? askAmount : -askAmount;
    setOffset(offset + amount);
  };

  // NOTE: in order to sort on a particular column, it must be registered
  // as a sorter in '../utils'. If it's not, there won't be any errors;
  // sorting on that column simply won't work.
  const onHeaderClick = useCallback((e, { name: column }) => {
    if (['dnd', 'select'].includes(column) || isMoving) return;

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
        draggable={isMoving}
        {...props}
      />
    );
  };

  const renderEmptyBox = () => {
    return !contentData.length && isMoving && (
      <div
        style={{
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          color: '#666',
          fontSize: '14px',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Drop items here
      </div>
    );
  };

  if (isLoading) {
    return <Loading size="large" />;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
      }}
    >
      <SortableContext
        id={`sortable-context-${holding.id}`}
        items={contentData.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <MultiColumnList
          id={`list-items-${holding.id}`}
          columnIdPrefix={`list-items-${holding.id}`}
          contentData={contentData}
          rowMetadata={rowMetadata}
          formatter={formatter}
          visibleColumns={isMoving ? dragVisibleColumns : visibleColumns}
          columnMapping={columnMapping}
          ariaLabel={ariaLabel}
          interactive={false}
          onNeedMoreData={onNeedMoreData}
          columnWidths={columnWidths}
          pagingType={MCLPagingTypes.PREV_NEXT}
          totalCount={total}
          nonInteractiveHeaders={isMoving ? visibleColumns : ['loanType', 'effectiveLocation', 'materialType']}
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
        {renderEmptyBox()}
      </SortableContext>
    </div>
  );
};

export default ItemsList;
