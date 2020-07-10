import React, {
  useCallback,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Draggable } from 'react-beautiful-dnd';
import { FormattedMessage } from 'react-intl';

import HoldingMovement from './HoldingMovement';

const dragStyles = {
  background: '#333',
  color: '#fff',
  borderRadius: '3px',
  padding: '5px',
  width: 'fit content',
};

const getItemStyle = (draggableStyle, selected, dragging) => {
  return {
    userSelect: 'none',
    width: '100%',
    background: selected ? 'rgba(33, 150, 243, 0.3)' : undefined,
    ...draggableStyle,
    ...(dragging ? dragStyles : {}),
  };
};

const Holding = ({
  provided,
  snapshot,
  selected,
  draggingItemsCount,
  holding,
  referenceData,
  onViewHolding,
  onAddItem,
  ...rest
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
      id={`item-row-${holding.id}`}
      data-row-inner
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}

      style={getItemStyle(
        provided.draggableProps.style,
        selected,
        snapshot.isDragging,
      )}
    >
      {
        snapshot.isDragging
          ? (
            <FormattedMessage
              id="ui-inventory.moveItems.move.items.count"
              values={{ count: draggingItemsCount || 1 }}
            />
          ) : (
            <HoldingMovement
              {...rest}
              holding={holding}
              referenceData={referenceData}
              onViewHolding={onViewHolding}
              onAddItem={onAddItem}
            />
          )
      }
    </div>
  );

  if (!snapshot.isDragging) return child;

  return ReactDOM.createPortal(child, document.getElementById('ModuleContainer'));
};

const HoldingMovementContainer = ({
  location,
  history,

  instance,
  holding,
  referenceData,
  holdingindex,
  ...rest
}) => {
  const onViewHolding = useCallback(() => {
    history.push({
      pathname: `/inventory/view/${instance.id}/${holding.id}`,
      search: location.search,
    });
  }, [location.search, instance.id, holding.id]);

  const onAddItem = useCallback(() => {
    history.push({
      pathname: `/inventory/create/${instance.id}/${holding.id}/item`,
      search: location.search,
    });
  }, [instance.id, holding.id]);

  return (
    <Draggable
      key={`${holding.id}`}
      draggableId={holding.id}
      index={holdingindex}
    >
      {(provided, snapshot) => (
        <div
          id={`item-row-${holding.id}`}
          data-row-inner
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}

          style={getItemStyle(
            provided.draggableProps.style,
            false,
            snapshot.isDragging,
          )}
        >
          {/* {
            snapshot.isDragging
              ? (
                <FormattedMessage
                  id="ui-inventory.moveItems.move.items.count"
                  values={{ count: 1 }}
                />
              ) : ( */}
                <HoldingMovement
                  {...rest}
                  holding={holding}
                  referenceData={referenceData}
                  onViewHolding={onViewHolding}
                  onAddItem={onAddItem}
                />
              {/* )
          } */}
        </div>
      )}
    </Draggable>
  );
};

HoldingMovementContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  instance: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  holdingindex: PropTypes.number.isRequired,
};

export default withRouter(HoldingMovementContainer);
