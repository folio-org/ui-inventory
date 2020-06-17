import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  get,
} from 'lodash';

import {
  Checkbox,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';

import { noValue } from '../../constants';
import { checkIfArrayIsEmpty } from '../../utils';

import ItemBarcode from './ItemBarcode';
import ItemsListRow from './ItemsListRow';
import {
  sortItems,
} from './utils';

const getTableAria = (intl) => intl.formatMessage({ id: 'ui-inventory.items' });
const getFormatter = (
  holdingsRecordId,
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
        (ariaLabel) => (
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
          holdingId={holdingsRecordId}
        />
      )
    ) || noValue;
  },
  'status': x => get(x, ['status', 'name']) || noValue,
  'materialType': x => get(x, ['materialType', 'name']) || noValue,
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
  'materialType': intl.formatMessage({ id: 'ui-inventory.materialType' }),
  'enumeration': intl.formatMessage({ id: 'ui-inventory.enumeration' }),
  'chronology': intl.formatMessage({ id: 'ui-inventory.chronology' }),
  'volume': intl.formatMessage({ id: 'ui-inventory.volume' }),
  'yearCaption': intl.formatMessage({ id: 'ui-inventory.yearCaption' }),
});
const visibleColumns = [
  'barcode',
  'status',
  'materialType',
  'enumeration',
  'chronology',
  'volume',
  'yearCaption',
];
const dragVisibleColumns = ['dnd', 'select', ...visibleColumns];
const rowMetadata = ['id', 'holdingsRecordId'];

const ItemsList = ({
  holding,
  items,

  draggable,
  droppable,
  ifItemsDragSelected,
  selectItemsForDrag,
  getDraggingItems,
  activeDropZone,
}) => {
  const intl = useIntl();

  const [itemsSorting, setItemsSorting] = useState({
    isDesc: false,
    column: 'barcode',
  });
  const [records, setRecords] = useState([]);

  const ariaLabel = useMemo(() => getTableAria(intl), []);
  const columnMapping = useMemo(
    () => getColumnMapping(intl, holding.id, records, ifItemsDragSelected, selectItemsForDrag),
    [holding.id, records, ifItemsDragSelected, selectItemsForDrag],
  );
  const formatter = useMemo(
    () => getFormatter(holding.id, selectItemsForDrag, ifItemsDragSelected),
    [holding.id, selectItemsForDrag, ifItemsDragSelected],
  );
  const rowProps = useMemo(() => ({
    draggable,
    ifItemsDragSelected,
    getDraggingItems,
  }), [draggable, ifItemsDragSelected, getDraggingItems]);

  useEffect(() => {
    setRecords(checkIfArrayIsEmpty(sortItems(items, itemsSorting)));
  }, [items, itemsSorting]);

  const onHeaderClick = useCallback((e, { name: column }) => {
    if (['dnd', 'select'].includes(column)) return;

    const isChangeDirection = itemsSorting.column === column;

    const newItemsSorting = {
      column: isChangeDirection ? itemsSorting.column : column,
      isDesc: isChangeDirection ? !itemsSorting.isDesc : true,
    };

    setItemsSorting(newItemsSorting);
  }, [itemsSorting]);

  return (
    <Droppable
      droppableId={holding.id}
      isDropDisabled={!droppable || activeDropZone === holding.id}
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          data-test-items
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

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

ItemsList.propTypes = {
  holding: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  selectItemsForDrag: PropTypes.func.isRequired,
  ifItemsDragSelected: PropTypes.func.isRequired,
  getDraggingItems: PropTypes.func.isRequired,
  activeDropZone: PropTypes.string,
};

ItemsList.defaultProps = {
  items: [],
};

export default ItemsList;
