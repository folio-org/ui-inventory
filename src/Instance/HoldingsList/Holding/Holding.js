import React, {
  useMemo,
  useCallback,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
} from '@folio/stripes/core';
import {
  Accordion,
  Row,
  Col,
  Button,
  Checkbox,
} from '@folio/stripes/components';

import {
  callNumberLabel
} from '../../../utils';
import { ItemsListContainer } from '../../ItemsList';
import { MoveToDropdown } from './MoveToDropdown';
import DnDContext from '../../DnDContext';
import { DataContext } from '../../../contexts';

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
}) => {
  const {
    selectItemsForDrag,
    isItemsDragSelected,
    getDraggingItems,
    activeDropZone,
    isItemsDroppable,
    selectedItemsMap,
    selectedHoldingsMap,
  } = useContext(DnDContext);

  const { locationsById } = useContext(DataContext);
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';
  const withMoveDropdown = draggable || isDraggable;

  const [open, setOpen] = useState(false);

  const handleAccordionToggle = () => setOpen(!open);

  const viewHoldings = useCallback(() => {
    onViewHolding();
  }, [onViewHolding]);

  const addItem = useCallback(() => {
    onAddItem();
  }, [onAddItem]);

  const holdingButtonsGroup = useMemo(() => {
    return (
      <>
        {
          withMoveDropdown && (
            <MoveToDropdown
              holding={holding}
              holdings={holdings}
              locationsById={locationsById}
            />
          )
        }

        <Button
          id={`clickable-view-holdings-${holding.id}`}
          data-test-view-holdings
          onClick={viewHoldings}
        >
          <FormattedMessage id="ui-inventory.viewHoldings" />
        </Button>

        <IfPermission perm="ui-inventory.item.create">
          <Button
            id={`clickable-new-item-${holding.id}`}
            data-test-add-item
            onClick={addItem}
            buttonStyle="primary paneHeaderNewButton"
          >
            <FormattedMessage id="ui-inventory.addItem" />
          </Button>
        </IfPermission>
      </>
    );
  }, [holding.id, viewHoldings, addItem, withMoveDropdown, selectedItemsMap, selectedHoldingsMap, labelLocation]);

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
      <Accordion
        id={holding.id}
        open={open}
        onToggle={handleAccordionToggle}
        label={(
          <FormattedMessage
            id="ui-inventory.holdingsHeader"
            values={{
              location: labelLocation,
              callNumber: callNumberLabel(holding),
              copyNumber: holding.copyNumber,
            }}
          />
        )}
        displayWhenOpen={holdingButtonsGroup}
        displayWhenClosed={holdingButtonsGroup}
      >
        <Row>
          <Col sm={12}>
            <ItemsListContainer
              key={`items_${holding.id}`}
              holding={holding}
              setOpen={setOpen}

              draggable={draggable}
              droppable={droppable}
              isItemsDragSelected={isItemsDragSelected}
              selectItemsForDrag={selectItemsForDrag}
              getDraggingItems={getDraggingItems}
              activeDropZone={activeDropZone}
              isItemsDroppable={isItemsDroppable}
            />
          </Col>
        </Row>
      </Accordion>
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
};

export default Holding;
