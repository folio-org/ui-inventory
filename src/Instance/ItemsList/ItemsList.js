import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Checkbox,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';

import { noValue } from '../../constants';
import { checkIfArrayIsEmpty } from '../../utils';

import ItemBarcode from './ItemBarcode';
import ItemsListRow from './ItemsListRow';
import DropZone from './DropZone';
import {
  sortItems,
} from './utils';

const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });
const getFormatter = (
  holding,
  selectItemsForDrag,
  ifItemsSelected,
) => ({
  'dnd': () => (
    <Icon
      icon="drag-drop"
      size="small"
    />
  ),
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
        <ItemBarcode
          item={item}
          holdingId={holding.id}
          instanceId={holding.instanceId}
        />
      )
    ) || noValue;
  },
  'status': x => x.status?.name || noValue,
  'copyNumber': ({ copyNumber }) => copyNumber || noValue,
  'materialType': x => x.materialType?.name || noValue,
  'loanType': x => x.temporaryLoanType?.name || x.permanentLoanType?.name || noValue,
  'effectiveLocation': x => x.effectiveLocation?.name || noValue,
  'enumeration': x => x.enumeration || noValue,
  'chronology': x => x.chronology || noValue,
  'volume': x => x.volume || noValue,
  'yearCaption': x => x.yearCaption?.join(', ') || noValue,
});
const getColumnMapping = (intl, holdingsRecordId, items, ifItemsSelected, selectItemsForDrag) => ({
  'dnd': '',
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
  'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
  'loanType': intl.formatMessage({ id: 'ui-inventory.loanType' }),
  'effectiveLocation': intl.formatMessage({ id: 'ui-inventory.effectiveLocationShort' }),
  'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
  'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
  'volume': intl.formatMessage({ id: 'ui-inventory.volume' }),
  'yearCaption': intl.formatMessage({ id: 'ui-inventory.yearCaption' }),
});
const visibleColumns = [
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
const dragVisibleColumns = ['dnd', 'select', ...visibleColumns];
const rowMetadata = ['id', 'holdingsRecordId'];

const ItemsList = ({
  holding,
  items,

  draggable,
  droppable,
  isItemsDragSelected,
  selectItemsForDrag,
  getDraggingItems,
  activeDropZone,
  isItemsDroppable,
}) => {
  const intl = useIntl();

  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: 'barcode',
  });
  const [records, setRecords] = useState([]);

  const ariaLabel = useMemo(() => getTableAria(intl), []);
  const columnMapping = useMemo(
    () => getColumnMapping(intl, holding.id, records, isItemsDragSelected, selectItemsForDrag),
    [holding.id, records, isItemsDragSelected, selectItemsForDrag],
  );
  const formatter = useMemo(
    () => getFormatter(holding, selectItemsForDrag, isItemsDragSelected),
    [holding, selectItemsForDrag, isItemsDragSelected],
  );
  const rowProps = useMemo(() => ({
    draggable,
    isItemsDragSelected,
    getDraggingItems,
  }), [draggable, isItemsDragSelected, getDraggingItems]);

  useEffect(() => {
    setRecords(checkIfArrayIsEmpty(sortItems(items, itemsSorting)));
  }, [items, itemsSorting]);

  // NOTE: in order to sort on a particular column, it must be registered
  // as a sorter in '../utils'. If it's not, there won't be any errors;
  // sorting on that column simply won't work.
  const onHeaderClick = useCallback((e, { name: column }) => {
    if (['dnd', 'select'].includes(column)) return;

    const isChangeDirection = itemsSorting.column === column;

    const newItemsSorting = {
      column: isChangeDirection ? itemsSorting.column : column,
      isDesc: isChangeDirection ? !itemsSorting.isDesc : true,
    };

    setItemsSorting(newItemsSorting);
  }, [itemsSorting]);

  if (!draggable && isEmpty(items)) return null;

  return (
    <DropZone
      isItemsDroppable={isItemsDroppable}
      droppableId={holding.id}
      isDropDisabled={!droppable || activeDropZone === holding.id}
    >
      <MultiColumnList
        id={`list-items-${holding.id}`}
        contentData={records}
        rowMetadata={rowMetadata}
        formatter={formatter}
        visibleColumns={draggable ? dragVisibleColumns : visibleColumns}
        columnMapping={columnMapping}
        ariaLabel={ariaLabel}
        interactive={false}
        onHeaderClick={onHeaderClick}
        sortDirection={itemsSorting.isDesc ? 'descending' : 'ascending'}
        sortedColumn={itemsSorting.column}
        rowFormatter={ItemsListRow}
        rowProps={rowProps}
      />
    </DropZone>
  );
};

ItemsList.propTypes = {
  holding: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  selectItemsForDrag: PropTypes.func.isRequired,
  isItemsDragSelected: PropTypes.func.isRequired,
  getDraggingItems: PropTypes.func.isRequired,
  activeDropZone: PropTypes.string,
  isItemsDroppable: PropTypes.bool,
};

ItemsList.defaultProps = {
  items: [],
  isItemsDroppable: true,
};

export default ItemsList;
