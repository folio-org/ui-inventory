import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isEmpty, keyBy } from 'lodash';

import {
  Checkbox,
  Icon,
  MultiColumnList,
  MCLPagingTypes,
} from '@folio/stripes/components';
import { itemStatuses } from '@folio/stripes-inventory-components';

import {
  DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  ITEM_TABLE_PAGE_AMOUNT,
  noValue,
} from '../../constants';
import { checkIfArrayIsEmpty } from '../../utils';

import ItemBarcode from './ItemBarcode';
import ItemsListRow from './ItemsListRow';
import useBoundWithHoldings from '../../Holding/ViewHolding/HoldingBoundWith/useBoundWithHoldings';

import { DataContext } from '../../contexts';

const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });

const getFormatter = (
  intl,
  locationsById,
  holdingsMapById,
  selectItemsForDrag,
  ifItemsSelected,
  isBarcodeAsHotlink,
  tenantId,
) => ({
  'dnd': () => (
    <Icon
      icon="drag-drop"
      size="small"
    />
  ),
  'order': (item) => item?.order || noValue,
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
    ) || noValue;
  },
  'status': x => {
    if (!x.status?.name) return noValue;

    const statusName = x.status.name;
    const itemStatusTranslationId = itemStatuses.find(({ value }) => value === statusName)?.label;

    return itemStatusTranslationId ? intl.formatMessage({ id: itemStatusTranslationId }) : statusName;
  },
  'copyNumber': ({ copyNumber }) => copyNumber || noValue,
  'loanType': x => x.temporaryLoanType?.name || x.permanentLoanType?.name || noValue,
  'effectiveLocation': x => {
    const effectiveLocation = locationsById[x.effectiveLocation?.id];
    return effectiveLocation?.isActive ?
      effectiveLocation?.name || noValue :
      intl.formatMessage(
        { id: 'ui-inventory.inactive.gridCell' },
        { location: effectiveLocation?.name }
      );
  },
  'enumeration': x => x.enumeration || noValue,
  'chronology': x => x.chronology || noValue,
  'volume': x => x.volume || noValue,
  'yearCaption': x => x.yearCaption?.join(', ') || noValue,
  'materialType': x => x.materialType?.name || noValue,
});
const getColumnMapping = (intl, holdingsRecordId, items, ifItemsSelected, selectItemsForDrag) => ({
  'dnd': '',
  'order': intl.formatMessage({ id: 'ui-inventory.item.order' }),
  'select': (
    <span data-test-select-all-items>
      <Checkbox
        id={`select-all-items-${holdingsRecordId}`}
        aria-label={intl.formatMessage({ id: 'ui-inventory.moveItems.selectAll' })}
        checked={ifItemsSelected(items)}
        onChange={() => selectItemsForDrag(items)}
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
  holding,
  setOffset,
  setSorting,
  selectItemsForDrag,
  isItemsDragSelected,
  getDraggingItems,
  isBarcodeAsHotlink,
  tenantId,
  items = [],
  total = 0,
  draggable = false,
  offset = 0,
  isFetching = false,
}) => {
  const { boundWithHoldings: holdings, isLoading } = useBoundWithHoldings(items, tenantId);
  const holdingsMapById = keyBy(holdings, 'id');
  const intl = useIntl();
  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: DEFAULT_ITEM_TABLE_SORTBY_FIELD,
  });
  const [records, setRecords] = useState([]);

  const { locationsById } = useContext(DataContext);
  const pagingCanGoPrevious = offset > 0;
  const pagingCanGoNext = offset < total && total - offset > ITEM_TABLE_PAGE_AMOUNT;

  const ariaLabel = useMemo(() => getTableAria(intl), []);
  const columnMapping = useMemo(
    () => getColumnMapping(intl, holding.id, records, isItemsDragSelected, selectItemsForDrag),
    [holding.id, records, isItemsDragSelected, selectItemsForDrag],
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
  const rowProps = useMemo(() => ({
    draggable,
    isItemsDragSelected,
    getDraggingItems,
  }), [draggable, isItemsDragSelected, getDraggingItems]);

  const onNeedMoreData = (askAmount, _index, _firstIndex, direction) => {
    const amount = (direction === 'next') ? askAmount : -askAmount;
    setOffset(offset + amount);
  };

  useEffect(() => {
    setRecords(checkIfArrayIsEmpty(items));
  }, [items]);

  // NOTE: in order to sort on a particular column, it must be registered
  // as a sorter in '../utils'. If it's not, there won't be any errors;
  // sorting on that column simply won't work.
  const onHeaderClick = useCallback((e, { name: column }) => {
    if (['dnd', 'order', 'select'].includes(column) || draggable) return;

    const isChangeDirection = itemsSorting.column === column;

    const newItemsSorting = {
      column: isChangeDirection ? itemsSorting.column : column,
      isDesc: isChangeDirection ? !itemsSorting.isDesc : true,
    };

    setItemsSorting(newItemsSorting);
    setSorting(`${newItemsSorting.isDesc ? '-' : ''}${newItemsSorting.column}`);
  }, [itemsSorting, draggable]);

  if ((!draggable && isEmpty(items)) || isLoading) return null;

  return (
    <MultiColumnList
      id={`list-items-${holding.id}`}
      columnIdPrefix={`list-items-${holding.id}`}
      contentData={records}
      rowMetadata={rowMetadata}
      formatter={formatter}
      visibleColumns={draggable ? dragVisibleColumns : visibleColumns}
      columnMapping={columnMapping}
      ariaLabel={ariaLabel}
      interactive={false}
      onNeedMoreData={onNeedMoreData}
      columnWidths={columnWidths}
      pagingType={MCLPagingTypes.PREV_NEXT}
      totalCount={total}
      nonInteractiveHeaders={draggable ? visibleColumns : ['order', 'loanType', 'effectiveLocation', 'materialType']}
      onHeaderClick={onHeaderClick}
      sortDirection={itemsSorting.isDesc ? 'descending' : 'ascending'}
      sortedColumn={itemsSorting.column}
      rowFormatter={ItemsListRow}
      pageAmount={ITEM_TABLE_PAGE_AMOUNT}
      rowProps={rowProps}
      pagingCanGoPrevious={pagingCanGoPrevious}
      pagingCanGoNext={pagingCanGoNext}
      pagingOffset={offset}
      loading={isFetching}
    />
  );
};

ItemsList.propTypes = {
  holding: PropTypes.object.isRequired,
  setOffset: PropTypes.func.isRequired,
  setSorting: PropTypes.func.isRequired,
  selectItemsForDrag: PropTypes.func.isRequired,
  isItemsDragSelected: PropTypes.func.isRequired,
  getDraggingItems: PropTypes.func.isRequired,
  isBarcodeAsHotlink: PropTypes.bool,
  tenantId: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  offset: PropTypes.number,
  total: PropTypes.number,
  draggable: PropTypes.bool,
  isFetching: PropTypes.bool,
};

export default ItemsList;
