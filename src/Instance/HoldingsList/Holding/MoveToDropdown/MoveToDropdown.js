import {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  DropdownMenu,
  Dropdown,
  DropdownButton,
  Button,
  List,
} from '@folio/stripes/components';

import { callNumberLabel } from '../../../../utils';
import useReferenceData from '../../../../hooks/useReferenceData';
// import useMoveCommands from '../../../../dnd/hooks/useMoveCommands'; // Temporarily removed to break cycle
import {
  useInventoryState,
  useSelection,
} from '../../../../dnd';

import styles from './MoveToDropdown.css';

const MoveToDropdown = ({
  holding,
  holdings,
}) => {
  const stripes = useStripes();

  const { locationsById } = useReferenceData();
  const state = useInventoryState();
  const {
    toggleHolding,
    isHoldingDragSelected,
    getSelectedItemsFromHolding: getDraggingItems,
  } = useSelection();

  // const {
  //   moveSelectedItemsToHolding,
  //   moveSelectedHoldingsToInstance,
  // } = useMoveCommands();

  const canMoveHoldings = stripes.hasPerm('ui-inventory.holdings.move');
  const canMoveItems = stripes.hasPerm('ui-inventory.item.move');

  // Mode detection: 1 instance = within-instance; 2 instances = dual-pane
  const instanceIds = useMemo(() => Object.keys(state.instances || {}), [state.instances]);
  const isMovementWithinInstance = instanceIds.length === 1; // move within instance mode
  const isDualPane = instanceIds.length === 2; // move between instances mode

  const fromInstanceId = holding.instanceId;

  const toInstanceId = useMemo(() => {
    if (!isDualPane) return fromInstanceId;

    return instanceIds.find(id => id !== fromInstanceId) || null;
  }, [isDualPane, fromInstanceId, instanceIds]);

  // Selection local to THIS holding
  const selectedItemIdsHere = getDraggingItems(holding.id) || [];
  const hasItemsSelectedHere = selectedItemIdsHere.size > 0;
  const isHoldingSelectedHere = isHoldingDragSelected(holding.id);

  const itemsCountInHolding = state.holdings?.[holding.id]?.itemIds?.length;
  const hasAnyItemsInThisHolding = typeof itemsCountInHolding === 'number'
    ? itemsCountInHolding > 0
    : hasItemsSelectedHere;

  // Count holdings within current instance
  const holdingsCountInInstance =
    state.instances?.[fromInstanceId]?.holdingIds?.length ??
    holdings.filter(h => h.instanceId === fromInstanceId).length;

  const disableInSingle = isMovementWithinInstance &&
    (!canMoveItems || !hasAnyItemsInThisHolding || holdingsCountInInstance <= 1 || !hasItemsSelectedHere);

  // Items mode (only if items in current holding are selected)
  const itemsMode = canMoveItems && hasItemsSelectedHere;

  // In single-pane, show other holdings from the same instance (excluding current)
  // In dual-pane, show holdings from the other instance
  const moveToHoldings = useMemo(() => {
    if (!itemsMode) return [];

    const pool = isDualPane
      ? Object.values(state.holdings || {}).filter(h => h.instanceId === toInstanceId)
      : holdings.filter(h => h.instanceId === fromInstanceId && h.id !== holding.id);

    return pool
      .filter(h => h.id !== holding.id)
      .map(h => ({
        ...h,
        labelLocation: locationsById[h.permanentLocationId]?.name ?? '',
        callNumber: callNumberLabel(h),
      }));
  }, [itemsMode, isDualPane, state.holdings, toInstanceId, holdings, fromInstanceId, holding.id, locationsById]);

  // Dual-pane “instance-only” menu when:
  // - no items/holdings selected, or
  // - current holding is selected to move
  const showInstanceOnly = isDualPane && (!itemsMode || isHoldingSelectedHere);

  const getMoveToHoldingLabel = useCallback((targetHolding) => {
    const instTitle = state.instances[targetHolding.instanceId]?.title || '';

    const holdingLabel = [targetHolding.labelLocation, targetHolding.callNumber].filter(Boolean).join(' ');

    if (isDualPane) return [instTitle, holdingLabel].filter(Boolean).join(' ');

    return holdingLabel;
  }, [state.instances, isDualPane]);

  const dropdownButton = useCallback(({ getTriggerProps }) => (
    <DropdownButton
      {...getTriggerProps()}
      id={`clickable-move-holdings-${holding.id}`}
      data-test-move-holdings
    >
      <FormattedMessage id="ui-inventory.moveItems.moveButton" />
    </DropdownButton>
  ), [holding.id]);

  const getItemListFormatter = (moveToHolding, i, onToggle) => {
    return (
      <li
        key={i}
        data-to-id={moveToHolding.id}
        data-item-id={holding.id}
      >
        <Button
          buttonStyle="dropdownItem"
          role="menuitem"
          onClick={async () => {
            // await moveSelectedItemsToHolding(holding.id, moveToHolding.id);
            onToggle();
          }}
        >
          {getMoveToHoldingLabel(moveToHolding)}
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
      {isDualPane && showInstanceOnly && canMoveHoldings ? (
        <Button
          buttonStyle="dropdownItem"
          role="menuitem"
          onClick={async () => {
            // await moveSelectedHoldingsToInstance(holding.id, fromInstanceId, toInstanceId, state.instances[toInstanceId]?.hrid);
            onToggle();
            console.log('Move holdings to instance:', holding.id, fromInstanceId, toInstanceId);
          }}
        >
          {state.instances[toInstanceId]?.title}
        </Button>
      ) : canMoveItems && (
        <List
          listClass={styles.customList}
          items={moveToHoldings}
          itemFormatter={(item, i) => getItemListFormatter(item, i, onToggle)}
        />
      )}
    </DropdownMenu>
  );

  return (
    <Dropdown
      renderTrigger={dropdownButton}
      renderMenu={dropdownMenu}
      disabled={disableInSingle}
    />
  );
};

MoveToDropdown.propTypes = {
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  locationsById: PropTypes.object,
};

export default MoveToDropdown;
