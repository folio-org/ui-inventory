import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PropTypes from 'prop-types';

import {
  Checkbox,
  TextField,
} from '@folio/stripes/components';

import DropZone from '../../dnd/DropZone';
import DraggableHandle from './DraggableHandle';

export const getDraggableFormatter = ({
  holdingId,
  ifItemsSelected,
  selectItemForDrag,
  onOrderChange,
  validationErrors,
  changedOrdersMap,
  isFetching,
}) => ({
  'dnd': (item) => (
    <DraggableHandle itemId={item.id} holdingId={holdingId} />
  ),
  'select': (item) => (
    <FormattedMessage id="ui-inventory.moveItems.selectItem">
      {
        ([ariaLabel]) => (
          <span>
            <Checkbox
              id={`select-item-${item.id}`}
              aria-label={ariaLabel}
              checked={ifItemsSelected([item.id])}
              onChange={() => selectItemForDrag(item.id)}
              disabled={isFetching}
            />
          </span>
        )
      }
    </FormattedMessage>
  ),
  'order': item => (
    <FormattedMessage id="ui-inventory.item.order">
      {
        ([ariaLabel]) => (
          <TextField
            aria-label={`${ariaLabel}-${item.order}`}
            value={item.order}
            onChange={(e) => onOrderChange(e, item.id)}
            error={validationErrors?.get(item.id)}
            dirty={changedOrdersMap.has(item.id)}
            hasClearIcon={false}
          />
        )
      }
    </FormattedMessage>
  )
});
export const getDraggableColumnMapping = ({
  intl,
  items,
  holdingsRecordId,
  ifItemsSelected,
  selectAllItemsForDrag,
  isFetching,
}) => ({
  'dnd': '',
  'select': (
    <span>
      <Checkbox
        id={`select-all-items-${holdingsRecordId}`}
        aria-label={intl.formatMessage({ id: 'ui-inventory.moveItems.selectAll' })}
        checked={ifItemsSelected(items.map(({ id }) => id))}
        onChange={(e) => selectAllItemsForDrag(holdingsRecordId, e.target?.checked)}
        disabled={isFetching}
      />
    </span>
  ),
});
export const draggableVisibleColumns = [
  'dnd',
  'order',
  'select',
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

const DraggableItemsList = ({
  children,
  itemId: id,
  isItemsMovement,
  holding,
  contentData,
  isFetching,
}) => {
  const { setNodeRef } = useDroppable({
    id: `holding-items:${id}`,
    data: {
      kind: 'HOLDING_ITEMS',
      holdingId: id,
      accepts: ['ITEM'],
    },
    disabled: !isItemsMovement,
  });

  const showDropZone = useMemo(() => isItemsMovement && !isFetching && !contentData.length,
    [isItemsMovement, isFetching, contentData]);

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
      }}
    >
      <SortableContext
        id={`sortable-context-${holding.id}`}
        items={contentData.map(i => `item:${i.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {showDropZone
          ? (
            <DropZone>
              <FormattedMessage id="ui-inventory.moveItems.items.dropZone" />
            </DropZone>
          )
          : children}
      </SortableContext>
    </div>
  );
};

DraggableItemsList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  itemId: PropTypes.string,
  isItemsMovement: PropTypes.bool,
  holding: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  isFetching: PropTypes.bool,
};

export default DraggableItemsList;
