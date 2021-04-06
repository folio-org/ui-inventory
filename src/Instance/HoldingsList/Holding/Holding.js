import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { ItemsListContainer, DropZone } from '../../ItemsList';

import HoldingAccordion from './HoldingAccordion';

const Holding = ({
  holding,
  onViewHolding,
  onAddItem,
  holdings,
  draggable,
  droppable,
  selectHoldingsForDrag,
  isHoldingDragSelected,
  isDraggable,
  isItemsDroppable,
}) => {
  return (
    <div>
      {isDraggable &&
        <FormattedMessage id="ui-inventory.moveItems.selectItem">
          {
            ([ariaLabel]) => (
              <span data-test-select-holding>
                <Checkbox
                  id={`select-holding-${holding.id}`}
                  aria-label={ariaLabel}
                  checked={isHoldingDragSelected(holding)}
                  onChange={() => selectHoldingsForDrag(holding)}
                />
              </span>
            )
          }
        </FormattedMessage>
      }
      <DropZone
        isItemsDroppable={isItemsDroppable}
        droppableId={holding.id}
        isDropDisabled={!droppable}
      >
        <HoldingAccordion
          key={`items_${holding.id}`}
          holding={holding}
          withMoveDropdown={draggable || isDraggable}
          holdings={holdings}
          onViewHolding={onViewHolding}
          onAddItem={onAddItem}
        >
          {
            ({ items, handleAccordionToggle }) => (
              <ItemsListContainer
                holding={holding}
                draggable={draggable}
                droppable={droppable}
                items={items}
                handleAccordionToggle={handleAccordionToggle}
              />
            )
          }
        </HoldingAccordion>
      </DropZone>
    </div>
  );
};

Holding.propTypes = {
  holding: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  isDraggable: PropTypes.bool,
  selectHoldingsForDrag: PropTypes.func,
  isHoldingDragSelected: PropTypes.func,
  isItemsDroppable: PropTypes.bool,
};

Holding.defaultProps = {
  isItemsDroppable: true,
};

export default Holding;
