import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useSelection } from '../../../dnd';

const DraggableHolding = ({
  children,
  holding,
  instanceId,
  isHoldingsMovement,
}) => {
  const {
    setNodeRef: setDragRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `holding:${holding.id}`,
    data: { type: 'HOLDING', holdingId: holding.id, instanceId },
    disabled: !isHoldingsMovement,
  });
  const style = {
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const {
    toggleHolding: selectHoldingForDrag,
    isHoldingDragSelected,
  } = useSelection();

  const onSelectHolding = useCallback((checked) => {
    selectHoldingForDrag(holding.id, checked);
  }, [selectHoldingForDrag]);

  const isHoldingSelected = useMemo(() => {
    return isHoldingDragSelected(holding.id);
  }, [isHoldingDragSelected, holding.id]);

  const draggableProps = { setActivatorNodeRef, attributes, listeners, onSelectHolding, isHoldingSelected };

  return (
    <div ref={setDragRef} style={style}>
      {children(draggableProps)}
    </div>
  );
};

DraggableHolding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  holding: PropTypes.object,
  instanceId: PropTypes.string,
  isHoldingsMovement: PropTypes.bool,
};

export default DraggableHolding;
