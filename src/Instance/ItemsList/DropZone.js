import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

const DropZone = ({
  isItemsDroppable,
  children,
  droppableId,
  isDropDisabled,
}) => {
  return isItemsDroppable ? (
    <Droppable
      droppableId={droppableId}
      isDropDisabled={isDropDisabled}
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          data-test-items
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ) : (
    <>
      {children}
    </>
  );
};

DropZone.propTypes = {
  isItemsDroppable: PropTypes.bool.isRequired,
  droppableId: PropTypes.string.isRequired,
  isDropDisabled: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};

export default DropZone;
