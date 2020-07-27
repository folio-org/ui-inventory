import React, {
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { FormattedMessage } from 'react-intl';

const dragStyles = {
  background: '#333',
  color: '#fff',
  borderRadius: '3px',
  padding: '5px',
  width: '300px',
};

const getItemStyle = (draggableStyle, selected, dragging) => {
  return {
    userSelect: 'none',
    width: 'fit-content',
    background: selected ? 'rgba(33, 150, 243, 0.3)' : undefined,
    ...draggableStyle,
    ...(dragging ? dragStyles : {}),
  };
};

const Row = ({
  provided,
  snapshot,
  selected,
  draggingItemsCount,

  rowData,
  rowClass,
  cells,
}) => {
  const rowStyles = useMemo(() => (
    getItemStyle(
      provided.draggableProps.style,
      selected,
      snapshot.isDragging,
    )
  ), [provided.draggableProps.style, selected, snapshot.isDragging]);

  const child = (
    <div
      id={`item-row-${rowData.id}`}
      data-row-inner
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}

      className={rowClass}
      role="row"
      tabIndex="0"

      style={rowStyles}
    >
      {
        snapshot.isDragging
          ? (
            <FormattedMessage
              id="ui-inventory.moveItems.move.items.count"
              values={{ count: draggingItemsCount || 1 }}
            />
          )
          : cells
      }
    </div>
  );

  if (!snapshot.isDragging) return child;

  return ReactDOM.createPortal(child, document.getElementById('ModuleContainer'));
};

const ItemsListRow = ({
  rowClass,
  cells,
  rowIndex,
  rowData,
  rowProps,
}) => {
  const {
    draggable,
    isItemsDragSelected,
    getDraggingItems,
  } = rowProps;

  const draggingItemsCount = getDraggingItems()?.items?.length;

  return (
    <Draggable
      key={`${rowData.id}`}
      draggableId={`${rowData.id}`}
      index={rowIndex}
      isDragDisabled={!draggable}
    >
      {(provided, snapshot) => (
        <Row
          provided={provided}
          snapshot={snapshot}
          selected={isItemsDragSelected([rowData])}
          draggingItemsCount={draggingItemsCount}

          cells={cells}
          rowClass={rowClass}
          rowData={rowData}
        />
      )}
    </Draggable>
  );
};

ItemsListRow.propTypes = {
  rowClass: PropTypes.arrayOf(PropTypes.string).isRequired,
  cells: PropTypes.arrayOf(PropTypes.node).isRequired,
  rowIndex: PropTypes.number.isRequired,
  rowData: PropTypes.object.isRequired,
  rowProps: PropTypes.object.isRequired,
};

export default ItemsListRow;
