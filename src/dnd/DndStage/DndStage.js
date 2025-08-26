import { createPortal } from 'react-dom';
import { FormattedMessage } from 'react-intl';
import {
  closestCenter,
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

import { useDndHandlers } from '../hooks';
import { useSelection } from '../SelectionProvider';

export const DndStage = ({ children }) => {
  const { selectedItems } = useSelection();
  const { onDragStart, onDragOver, onDragEnd, activeDragItem } = useDndHandlers();

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}
      {activeDragItem && createPortal(
        <DragOverlay modifiers={[snapCenterToCursor]}>
          <div style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            fontSize: '14px',
            fontWeight: '600',
            border: '2px solid #007bff',
            width: 'auto',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          >
            <FormattedMessage
              id="ui-inventory.moveItems.move.items.count"
              values={{ count: selectedItems.size || 1 }}
            />
          </div>
        </DragOverlay>,
        document.getElementById('ModuleContainer'),
      )}
    </DndContext>
  );
};
