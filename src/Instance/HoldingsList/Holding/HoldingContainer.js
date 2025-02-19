import React, {
  useCallback,
  useMemo,
  useContext,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Draggable } from 'react-beautiful-dnd';
import { FormattedMessage } from 'react-intl';

import {
  useStripes,
  CalloutContext,
} from '@folio/stripes/core';

import Holding from './Holding';
import {
  navigateToHoldingsViewPage,
  navigateToItemCreatePage,
} from '../../utils';
import { sendCalloutOnAffiliationChange } from '../../../utils';

const dragStyles = {
  background: '#333',
  color: '#fff',
  borderRadius: '3px',
  padding: '5px',
  width: 'fit content',
  height: 'fit content'
};

const getItemStyle = (draggableStyle, dragging) => {
  return {
    userSelect: 'none',
    width: '100%',
    ...draggableStyle,
    ...(dragging ? dragStyles : {}),
  };
};

const DraggableHolding = ({
  provided,
  snapshot,
  draggingHoldingsCount,
  holding,
  onViewHolding,
  onAddItem,
  tenantId,
  showViewHoldingsButton,
  showAddItemButton,
  isBarcodeAsHotlink,
  instanceId,
  pathToAccordionsState = [],
  ...rest
}) => {
  const rowStyles = useMemo(() => (
    getItemStyle(
      provided.draggableProps.style,
      snapshot.isDragging,
    )
  ), [provided.draggableProps.style, snapshot.isDragging]);
  const child = (
    <div
      id={`item-row-${holding.id}`}
      data-row-inner
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={rowStyles}
    >
      {
        snapshot.isDragging
          ? (
            <FormattedMessage
              id="ui-inventory.moveItems.move.holdings.count"
              values={{ count: draggingHoldingsCount || 1 }}
            />
          ) : (
            <Holding
              {...rest}
              isDraggable
              holding={holding}
              onViewHolding={onViewHolding}
              onAddItem={onAddItem}
              tenantId={tenantId}
              showViewHoldingsButton={showViewHoldingsButton}
              showAddItemButton={showAddItemButton}
              isBarcodeAsHotlink={isBarcodeAsHotlink}
              instanceId={instanceId}
              pathToAccordionsState={pathToAccordionsState}
            />
          )
      }
    </div>
  );

  if (!snapshot.isDragging) return child;

  return ReactDOM.createPortal(child, document.getElementById('ModuleContainer'));
};

DraggableHolding.propTypes = {
  draggingHoldingsCount: PropTypes.number,
  provided: PropTypes.object.isRequired,
  snapshot: PropTypes.object.isRequired,
  instanceId: PropTypes.string.isRequired,
  holding: PropTypes.object,
  onViewHolding: PropTypes.func,
  onAddItem: PropTypes.func,
  tenantId: PropTypes.string,
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  isBarcodeAsHotlink: PropTypes.bool,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

const HoldingContainer = ({
  location,
  history,
  showViewHoldingsButton,
  showAddItemButton,
  isBarcodeAsHotlink,
  instance,
  holding,
  isDraggable = false,
  holdingIndex,
  draggingHoldingsCount,
  tenantId,
  pathToAccordionsState = [],
  ...rest
}) => {
  const stripes = useStripes();
  const callout = useContext(CalloutContext);

  const onViewHolding = useCallback(() => {
    navigateToHoldingsViewPage(history, location, instance, holding, tenantId, stripes.okapi.tenant);

    sendCalloutOnAffiliationChange(stripes, tenantId, callout);
  }, [location.search, instance.id, holding.id]);

  const onAddItem = useCallback(() => {
    navigateToItemCreatePage(history, location, instance, holding, tenantId, stripes.okapi.tenant);
  }, [location.search, instance.id, holding.id]);

  return isDraggable ? (
    <Draggable
      key={`${holding.id}`}
      draggableId={`holding-${holding.id}`}
      index={holdingIndex}
    >
      {(provided, snapshot) => (
        <DraggableHolding
          provided={provided}
          snapshot={snapshot}
          draggingHoldingsCount={draggingHoldingsCount}
          holding={holding}
          onViewHolding={onViewHolding}
          onAddItem={onAddItem}
          tenantId={tenantId}
          showViewHoldingsButton={showViewHoldingsButton}
          showAddItemButton={showAddItemButton}
          isBarcodeAsHotlink={isBarcodeAsHotlink}
          instanceId={instance?.id}
          pathToAccordionsState={pathToAccordionsState}
          {...rest}
        />
      )}
    </Draggable>
  ) : (
    <Holding
      {...rest}
      holding={holding}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
      tenantId={tenantId}
      showViewHoldingsButton={showViewHoldingsButton}
      showAddItemButton={showAddItemButton}
      isBarcodeAsHotlink={isBarcodeAsHotlink}
      instanceId={instance?.id}
      pathToAccordionsState={pathToAccordionsState}
    />
  );
};

HoldingContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  provided: PropTypes.object.isRequired,
  snapshot: PropTypes.object.isRequired,
  instance: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  holdingIndex: PropTypes.number,
  isDraggable: PropTypes.bool,
  draggingHoldingsCount: PropTypes.number,
  tenantId: PropTypes.string,
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  isBarcodeAsHotlink: PropTypes.bool,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

export default withRouter(HoldingContainer);
