import { FormattedMessage } from 'react-intl';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import DropZone from '../../dnd/DropZone';

const DraggableHoldingsList = ({
  children,
  holdingsContent = [],
  instanceId,
}) => {
  const { setNodeRef } = useDroppable({
    id: `instance:${instanceId}`,
    data: {
      kind: 'instance',
      id: instanceId,
      accepts: ['HOLDING'],
    },
  });

  return (
    <div ref={setNodeRef}>
      <SortableContext
        id={`holdings:${instanceId}`}
        items={holdingsContent.map(({ id }) => `holding:${id}`)}
        strategy={verticalListSortingStrategy}
      >
        {children}
        {!holdingsContent.length && (
          <DropZone>
            <FormattedMessage id="ui-inventory.moveItems.instance.dropZone" />
          </DropZone>
        )}
      </SortableContext>
    </div>
  );
};

export default DraggableHoldingsList;
