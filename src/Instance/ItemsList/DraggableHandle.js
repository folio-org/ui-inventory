import { useSortable } from '@dnd-kit/sortable';

import { Icon } from '@folio/stripes/components';

const DraggableHandle = ({ itemId }) => {
  const {
    attributes,
    listeners,
  } = useSortable({
    id: itemId,
  });

  const style = {
    cursor: 'grab',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div
      style={style}
      {...listeners}
      {...attributes}
    >
      <Icon
        icon="drag-drop"
        size="small"
      />
    </div>
  );
};

export default DraggableHandle;
