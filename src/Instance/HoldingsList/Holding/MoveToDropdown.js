import React, { useCallback } from 'react';
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
} from '../../../utils';

import styles from './MoveToDropdown.css';

const MoveToDropdown = ({
  allHoldings,
  instances,
  selectedItemsMap,
  onSelect,
  draggable,
  holding,
  holdings,
  labelLocation,
}) => {
  const stripes = useStripes();

  const filteredHoldings = allHoldings
    ? allHoldings.filter(item => item.id !== holding.id)
    : holdings.filter(item => item.id !== holding.id);
  const movetoHoldings = filteredHoldings.map(item => {
    return {
      ...item,
      labelLocation,
      callNumber: callNumberLabel(item),
    };
  });
  const fromSelectedMap = selectedItemsMap[holding.id] || {};
  const selectedItems = Object.keys(fromSelectedMap).filter(item => fromSelectedMap[item]);
  const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
  const canMoveItems = stripes.hasPerm('ui-inventory.item.move');

  const dropdownButton = useCallback(({ getTriggerProps }) => (
    <DropdownButton
      {...getTriggerProps()}
      id={`clickable-move-holdings-${holding.id}`}
      data-test-move-holdings
    >
      <FormattedMessage id="ui-inventory.moveItems.moveButton" />
    </DropdownButton>
  ), [holding.id]);

  const dropdownMenu = useCallback(() => (
    <DropdownMenu
      data-role="menu"
      data-test-move-to-dropdown
    >
      {
        instances && !selectedItems.length
          ? canMoveHoldings && (
            <div
              role="button"
              tabIndex={0}
              className={styles.dropDownItem}
              data-item-id={holding.id}
              data-to-id={
                instances[0].id === holding.instanceId
                  ? instances[1].id
                  : instances[0].id
              }
              data-is-holding
              onClick={onSelect}
              onKeyPress={onSelect}
            >
              {instances[0].id === holding.instanceId
                ? instances[1].title
                : instances[0].title}
            </div>
          )
          : canMoveItems && movetoHoldings.map((item, index) => (
            <div
              role="button"
              tabIndex={index}
              className={styles.dropDownItem}
              key={item.id}
              data-to-id={item.id}
              data-item-id={holding.id}
              onClick={onSelect}
              onKeyPress={onSelect}
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
            </div>
          ))}
    </DropdownMenu>
  ), [holding.id, selectedItems]);

  return draggable && (
    <Dropdown
      renderTrigger={dropdownButton}
      renderMenu={dropdownMenu}
    />
  );
};

MoveToDropdown.propTypes = {
  holding: PropTypes.object.isRequired,
  allHoldings: PropTypes.arrayOf(PropTypes.object),
  draggable: PropTypes.bool,
  instances: PropTypes.arrayOf(PropTypes.object),
  selectedItemsMap: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  labelLocation: PropTypes.string,
};

export default MoveToDropdown;
