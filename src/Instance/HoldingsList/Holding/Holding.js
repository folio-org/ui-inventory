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
  DropdownMenu,
  Dropdown,
  DropdownButton,
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
    isItemsDropable,
    instances,
    selectedItemsMap,
    allHoldings,
    onSelect,
  } = useContext(DnDContext);

  const [isDropdownOpen, toggleDropDown] = useState(false);
  const { locationsById } = referenceData;
  const labelLocation = holding.permanentLocationId ? locationsById[holding.permanentLocationId].name : '';
  const filteredHoldings = allHoldings
    ? allHoldings.filter(item => item.id !== holding.id)
    : holdings.filter(item => item.id !== holding.id);
  const movetoHoldings = filteredHoldings.map(item => {
    return {
      ...item,
      labelLocation: item.permanentLocationId ? locationsById[item.permanentLocationId].name : '',
      callNumber: callNumberLabel(item),
    };
  });
  const fromSelectedMap = selectedItemsMap[holding.id] || {};
  const selectedItems = Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);

  const viewHoldings = useCallback(() => {
    onViewHolding();
  }, [onViewHolding]);

  const addItem = useCallback(() => {
    onAddItem();
  }, [onAddItem]);

  const onDropdownToggle = useCallback(() => {
    toggleDropDown(!isDropdownOpen);
  }, [isDropdownOpen]);

  const holdingButtonsGroup = useMemo(() => {
    return (
      <>
        {draggable && (
          <Dropdown
            open={isDropdownOpen}
            onToggle={onDropdownToggle}
          >
            <DropdownButton
              data-role="toggle"
              id={`clickable-view-holdings-${holding.id}`}
              data-test-move-holdings
            >
              <FormattedMessage id="ui-inventory.moveItems.moveButton" />
            </DropdownButton>

            <DropdownMenu
              data-role="menu"
              data-test-move-to-dropdown
            >
              {
                instances && !selectedItems.length
                  ? (
                    <Button
                      buttonStyle="dropdownItem"
                      onClick={onSelect}
                      data-item-id={holding.id}
                      data-to-id={
                        instances[0].id === holding.instanceId
                          ? instances[1].id
                          : instances[0].id
                      }
                      data-is-holding
                    >
                      {instances[0].id === holding.instanceId
                        ? instances[1].title
                        : instances[0].title}
                    </Button>
                  )
                  : movetoHoldings.map(item => (
                    <Button
                      key={item.id}
                      buttonStyle="dropdownItem"
                      data-to-id={item.id}
                      data-item-id={holding.id}
                      onClick={onSelect}
                    >
                      {
                        instances?.filter(instance => instance.id === item.instanceId)[0].title
                      }
                      {' '}
                      {
                      selectedItems.length
                        ? `${item.labelLocation} ${item.callNumber}`
                        : ''
                      }
                    </Button>
                  ))}
            </DropdownMenu>
          </Dropdown>
        )}

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
  }, [holding.id, viewHoldings, addItem, isDropdownOpen, draggable]);

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
  holdings: PropTypes.arrayOf(PropTypes.object),

  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  isDraggable: PropTypes.bool,
  selectHoldingsForDrag: PropTypes.func.isRequired,
  isHoldingDragSelected: PropTypes.func.isRequired,
};

export default Holding;
