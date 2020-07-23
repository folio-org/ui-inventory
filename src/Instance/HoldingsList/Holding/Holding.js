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
import DataContext from '../../../contexts/DataContext';

const Holding = ({
  holding,
  referenceData,
  onViewHolding,
  onAddItem,

  draggable,
  droppable,
  selectHoldingsForDrag,
  ifHoldingDragSelected,
  withDraggableHolding,
}) => {
  const { locationsById } = referenceData;
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';
  const {
    selectItemsForDrag,
    ifItemsDragSelected,
    getDraggingItems,
    activeDropZone,
    isItemsDropable,
  } = useContext(DataContext);

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
      {withDraggableHolding &&
        <FormattedMessage id="ui-inventory.moveItems.selectItem">
          {
            (ariaLabel) => (
              <span data-test-select-holding>
                <Checkbox
                  id={`select-holding-${holding.id}`}
                  aria-label={ariaLabel}
                  checked={ifHoldingDragSelected(holding)}
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
              ifItemsDragSelected={ifItemsDragSelected}
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
  withDraggableHolding: PropTypes.bool,
  selectHoldingsForDrag: PropTypes.func.isRequired,
  ifHoldingDragSelected: PropTypes.func.isRequired,
};

export default Holding;
