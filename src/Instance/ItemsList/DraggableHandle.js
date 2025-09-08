import { useSortable } from '@dnd-kit/sortable';

import { Icon } from '@folio/stripes/components';
import PropTypes from 'prop-types';

const DraggableHandle = ({ itemId, holdingId }) => {
  const {
    attributes,
    listeners,
  } = useSortable({
    id: `item:${itemId}`,
    data: { type: 'ITEM', itemId, holdingId },
  });

  const style = {
    width: '100%',
    height: '100%',
    cursor: 'grab',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
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

DraggableHandle.propTypes = {
  itemId: PropTypes.string.isRequired,
  holdingId: PropTypes.string.isRequired,
};

export default DraggableHandle;
