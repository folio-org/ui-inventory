import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  useStripes,
} from '@folio/stripes/core';

import {
  DropdownMenu,
  Dropdown,
  DropdownButton,
  Button,
  List,
} from '@folio/stripes/components';

import { callNumberLabel } from '../../../../utils';
import { useMoveItemsContext } from '../../../../contexts';
import useReferenceData from '../../../../hooks/useReferenceData';

import styles from './MoveToDropdown.css';

export const MoveToDropdown = ({
  holding,
  holdings,
}) => {
  const stripes = useStripes();

  const { locationsById } = useReferenceData();
  const context = useMoveItemsContext();
  const {
    moveItemsToHolding,
    getDraggingItems,
    setItemsState,
  } = context;

  const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
  const canMoveItems = stripes.hasPerm('ui-inventory.item.move');

  // Get selected items within the current holding
  const holdingSelectedItems = getDraggingItems(holding.id);

  const filteredHoldings = holdings.filter(hld => hld.id !== holding.id);
  const movetoHoldings = filteredHoldings.map(item => {
    return {
      ...item,
      labelLocation: locationsById[item.permanentLocationId]?.name ?? '',
      callNumber: callNumberLabel(item),
    };
  });

  const isMoveToButtonEnabled = !isEmpty(holdingSelectedItems) && !isEmpty(movetoHoldings) && canMoveItems;

  const getMoveToHoldingLabel = useCallback(moveToHolding => {
    return `${moveToHolding.labelLocation} ${moveToHolding.callNumber}`;
  }, []);

  const dropdownButton = useCallback(({ getTriggerProps }) => (
    <DropdownButton
      {...getTriggerProps()}
      id={`clickable-move-holdings-${holding.id}`}
      data-test-move-holdings
    >
      <FormattedMessage id="ui-inventory.moveItems.moveButton" />
    </DropdownButton>
  ), [holding.id]);

  const onSelect = async (item) => {
    if (holdingSelectedItems.length > 0) {
      const itemIds = holdingSelectedItems.map(it => it.id);

      const onSuccess = setItemsState(holding.id, item.id, holdingSelectedItems);
      await moveItemsToHolding(holding.id, item.id, itemIds, { onSuccess });
    } else {
      console.log('No items selected for this holding');
    }
  };

  const getItemListFormatter = (item, i, onToggle) => {
    return (
      <li
        key={i}
        data-to-id={item.id}
        data-item-id={holding.id}
      >
        <Button
          buttonStyle="dropdownItem"
          role="menuitem"
          onClick={async () => {
            await onSelect(item);
            onToggle();
          }}
        >
          {getMoveToHoldingLabel(item)}
        </Button>
      </li>
    );
  };

  const dropdownMenu = ({ onToggle }) => (
    <DropdownMenu
      data-role="menu"
      data-test-move-to-dropdown
      onToggle={onToggle}
    >
      <List
        listClass={styles.customList}
        items={movetoHoldings}
        itemFormatter={(item, i) => getItemListFormatter(item, i, onToggle)}
      />
    </DropdownMenu>
  );

  return (
    <Dropdown
      renderTrigger={dropdownButton}
      renderMenu={dropdownMenu}
      disabled={!isMoveToButtonEnabled}
    />
  );
};

MoveToDropdown.propTypes = {
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  locationsById: PropTypes.object,
};

export default MoveToDropdown;
