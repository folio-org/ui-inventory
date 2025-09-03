import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Checkbox } from '@folio/stripes/components';

import DropZone from '../../dnd/DropZone';
import DraggableHandle from './DraggableHandle';

export const getDraggableFormater = ({ holdingId, ifItemsSelected, selectItemForDrag }) => ({
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
            />
          </span>
        )
      }
    </FormattedMessage>
  ),
});
export const getDraggableColumnMapping = ({
  intl,
  items,
  holdingsRecordId,
  ifItemsSelected,
  selectAllItemsForDrag,
}) => ({
  'dnd': '',
  'select': (
    <span>
      <Checkbox
        id={`select-all-items-${holdingsRecordId}`}
        aria-label={intl.formatMessage({ id: 'ui-inventory.moveItems.selectAll' })}
        checked={ifItemsSelected(items.map(({ id }) => id))}
        onChange={(e) => selectAllItemsForDrag(holdingsRecordId, e.target?.checked)}
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

export default DraggableItemsList;
