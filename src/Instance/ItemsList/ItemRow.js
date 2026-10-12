import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ItemRow = ({
  rowClass,
  rowData,
  cells,
  rowProps,
  draggable,
  holdingId,
}) => {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `item:${rowData.id}`,
    data: { type: 'ITEM', itemId: rowData.id, holdingId },
    disabled: !draggable,
  });

  const style = {
    cursor: 'default',
    opacity: isDragging ? 0.6 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div
        data-row-inner
        role="row"
        id={`item-row-${rowData.id}`}
        tabIndex="-1"
        className={rowClass}
        {...rowProps}
      >
        {cells}
      </div>
    </div>
  );
};

export default ItemRow;
