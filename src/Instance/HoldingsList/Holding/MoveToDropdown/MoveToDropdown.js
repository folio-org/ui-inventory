import React, {
  useCallback,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  useStripes,
} from '@folio/stripes/core';

import {
  DropdownMenu,
  Dropdown,
  DropdownButton,
} from '@folio/stripes/components';

import {
  callNumberLabel
} from '../../../../utils';
import { DataContext } from '../../../../contexts';
import DnDContext from '../../../DnDContext';

import styles from './MoveToDropdown.css';

export const MoveToDropdown = ({
  holding,
  holdings,
}) => {
  const stripes = useStripes();

  const { locationsById } = useContext(DataContext);

  const {
    instances = [],
    selectedItemsMap,
    allHoldings,
    onSelect,
  } = useContext(DnDContext);

  // when moving items within an instance the array is empty
  // when moving holdings/items to another instance the array contains two instances
  const [moveFromInstance, moveToInstance] = instances;
  const filteredHoldings = allHoldings
    ? allHoldings.filter(el => el.instanceId !== holding.instanceId)
    : holdings.filter(el => el.id !== holding.id);
  const movetoHoldings = filteredHoldings.map(item => {
    return {
      ...item,
      labelLocation: locationsById[item.permanentLocationId]?.name ?? '',
      callNumber: callNumberLabel(item),
    };
  });
  const fromSelectedMap = selectedItemsMap[holding.id] || {};
  const selectedItems = Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);
  const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
  const canMoveItems = stripes.hasPerm('ui-inventory.item.move');
  const isMovementWithinInstance = !instances.length;
  const canMoveItemsWithinInstance = selectedItems.length && movetoHoldings.length && canMoveItems;

  const dropdownButton = useCallback(({ getTriggerProps }) => (
    <DropdownButton
      {...getTriggerProps()}
      id={`clickable-move-holdings-${holding.id}`}
      data-test-move-holdings
    >
      <FormattedMessage id="ui-inventory.moveItems.moveButton" />
    </DropdownButton>
  ), [holding.id]);

  const createMoveToLabel = (moveToHolding) => {
    const moveToInstanceTitle = instances.filter(instance => instance.id === moveToHolding.instanceId)[0]?.title;
    const moveToHoldingsLabel = selectedItems.length ? `${moveToHolding.labelLocation} ${moveToHolding.callNumber}` : '';

    if (moveToInstanceTitle && !selectedItems.length) return moveToInstanceTitle;
    if (isMovementWithinInstance && moveToHoldingsLabel) return moveToHoldingsLabel;

    return `${moveToInstanceTitle} ${moveToHoldingsLabel}`;
  };

  const dropdownMenu = useCallback(() => (
    <DropdownMenu
      data-role="menu"
      data-test-move-to-dropdown
    >
      {
        !isMovementWithinInstance && !selectedItems.length
          ? canMoveHoldings && (
            <div
              role="button"
              tabIndex={0}
              className={styles.dropDownItem}
              data-item-id={holding.id}
              data-to-id={
                moveFromInstance.id === holding.instanceId
                  ? moveToInstance.id
                  : moveFromInstance.id
              }
              data-is-holding
              onClick={onSelect}
              onKeyPress={onSelect}
            >
              {moveFromInstance.id === holding.instanceId
                ? moveToInstance.title
                : moveFromInstance.title}
            </div>
          )
          : canMoveItems && movetoHoldings.map((moveToHolding, index) => (
            <div
              role="button"
              tabIndex={index}
              className={styles.dropDownItem}
              key={moveToHolding.id}
              data-to-id={moveToHolding.id}
              data-item-id={holding.id}
              onClick={onSelect}
              onKeyPress={onSelect}
            >
              {createMoveToLabel(moveToHolding)}
            </div>
          ))}
    </DropdownMenu>
  ), [holding.id, selectedItems]);

  return (
    <Dropdown
      renderTrigger={dropdownButton}
      renderMenu={dropdownMenu}
      disabled={isMovementWithinInstance && !canMoveItemsWithinInstance}
    />
  );
};

MoveToDropdown.propTypes = {
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  locationsById: PropTypes.object,
};

export default MoveToDropdown;
