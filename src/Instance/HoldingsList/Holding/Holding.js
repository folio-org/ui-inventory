import React, {
  useMemo,
  useCallback,
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
} from '@folio/stripes/components';

import {
  callNumberLabel
} from '../../../utils';
import { ItemsListContainer } from '../../ItemsList';

const Holding = ({
  holding,
  referenceDeata,
  onViewHolding,
  onAddItem,

  draggable,
  droppable,
  ifItemsDragSelected,
  selectItemsForDrag,
  getDraggingItems,
  activeDropZone,
}) => {
  const { locationsById } = referenceDeata;
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';

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
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Holding.propTypes = {
  holding: PropTypes.object.isRequired,
  referenceDeata: PropTypes.object.isRequired,
  onViewHolding: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  selectItemsForDrag: PropTypes.func.isRequired,
  ifItemsDragSelected: PropTypes.func.isRequired,
  getDraggingItems: PropTypes.func.isRequired,
  activeDropZone: PropTypes.string,
};

export default Holding;
