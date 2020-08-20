import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  DropdownMenu,
  Dropdown,
  DropdownButton,
} from '@folio/stripes/components';

const MoveToDropdown = ({
  movetoHoldings,
  instances,
  selectedItems,
  onSelect,
  draggable,
  holding,
}) => {
  const dropdownButton = ({ getTriggerProps }) => (
    <DropdownButton
      {...getTriggerProps()}
      id={`clickable-move-holdings-${holding.id}`}
      data-test-move-holdings
    >
      <FormattedMessage id="ui-inventory.moveItems.moveButton" />
    </DropdownButton>
  );

  const dropdownMenu = () => (
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
  );

  return draggable && (
    <Dropdown
      renderTrigger={dropdownButton}
      renderMenu={dropdownMenu}
      // open={isDropdownOpen}
      // onToggle={onDropdownToggle}
    />
  );
};

MoveToDropdown.propTypes = {
  holding: PropTypes.object.isRequired,
  movetoHoldings: PropTypes.arrayOf(PropTypes.object),
  draggable: PropTypes.bool,
  instances: PropTypes.arrayOf(PropTypes.object),
  selectedItems: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func.isRequired,
};

export default MoveToDropdown;
