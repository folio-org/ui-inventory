import React, {
  useMemo,
  useCallback,
  useContext,
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
import DnDContext from '../../DnDContext';

const Holding = ({
  holding,
  referenceData,
  onViewHolding,
  onAddItem,

  draggable,
  droppable,
  selectHoldingsForDrag,
  isHoldingDragSelected,
  isDraggable,
}) => {
  const { locationsById } = referenceData;
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';
  const {
    selectItemsForDrag,
    isItemsDragSelected,
    getDraggingItems,
    activeDropZone,
    isItemsDropable,
  } = useContext(DnDContext);

  const viewHoldings = useCallback(() => {
    onViewHolding();
  }, [onViewHolding]);

  const addItem = useCallback(() => {
    onAddItem();
  }, [onAddItem]);

  const holdingButtonsGroup = useMemo(() => {
    return (
      <>
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
  }, [holding.id, viewHoldings, addItem]);

  return (
    <div>
      {isDraggable &&
        <FormattedMessage id="ui-inventory.moveItems.selectItem">
          {
            (ariaLabel) => (
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
        closedByDefault={false}
        label={(
          <FormattedMessage
            id="ui-inventory.holdingsHeader"
            values={{
              location: labelLocation,
              callNumber: callNumberLabel(holding),
            }}
          />
        )}
        displayWhenOpen={holdingButtonsGroup}
      >
        <Row>
          <Col sm={12}>
            <ItemsListContainer
              key={`items_${holding.id}`}
              holding={holding}

              draggable={draggable}
              droppable={droppable}
              isItemsDragSelected={isItemsDragSelected}
              selectItemsForDrag={selectItemsForDrag}
              getDraggingItems={getDraggingItems}
              activeDropZone={activeDropZone}
              isItemsDropable={isItemsDropable}
            />
          </Col>
        </Row>
      </Accordion>
    </div>
  );
};

Holding.propTypes = {
  holding: PropTypes.object.isRequired,
  referenceData: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  isDraggable: PropTypes.bool,
  selectHoldingsForDrag: PropTypes.func.isRequired,
  isHoldingDragSelected: PropTypes.func.isRequired,
};

export default Holding;
