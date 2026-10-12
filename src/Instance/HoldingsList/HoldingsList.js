import {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import Holding from './Holding/Holding';
import DraggableHolding from './Holding/DraggableHolding';
import DraggableHoldingsList from './DraggableHoldingsList';

import { useInstanceHoldingsQuery } from '../../providers';
import { useInventoryActions } from '../../dnd';

const HoldingsList = ({
  instanceId,
  tenantId,
  pathToAccordionsState,
  isItemsMovement = false,
  isHoldingsMovement = false,
}) => {
  const stripes = useStripes();
  const actions = useInventoryActions();

  const canViewHoldingsAndItems = stripes.hasPerm('ui-inventory.instance.view');
  const canCreateItem = stripes.hasPerm('ui-inventory.item.create');

  const { holdingsRecords = [], isLoading } = useInstanceHoldingsQuery(instanceId, { tenantId });

  useEffect(() => {
    if (!isLoading) {
      actions.setHoldings(holdingsRecords);
    }
  }, [holdingsRecords, isLoading, instanceId, actions.setHoldings]);

  const renderHolding = useCallback((holding, props = {}) => {
    return (
      <Holding
        key={holding.id}
        id={holding.id}
        holding={holding}
        holdings={holdingsRecords}
        instanceId={instanceId}
        tenantId={tenantId}
        pathToAccordionsState={pathToAccordionsState}
        showViewHoldingsButton={canViewHoldingsAndItems}
        showAddItemButton={canCreateItem}
        isBarcodeAsHotlink={canViewHoldingsAndItems}
        isItemsMovement={isItemsMovement}
        isHoldingsMovement={isHoldingsMovement}
        {...props}
      />
    );
  }, [
    holdingsRecords,
    instanceId,
    tenantId,
    pathToAccordionsState,
    canViewHoldingsAndItems,
    canCreateItem,
    isItemsMovement,
    isHoldingsMovement,
  ]);

  if (isLoading) return <Loading size="large" />;

  if (isHoldingsMovement) {
    return (
      <DraggableHoldingsList
        holdingsContent={holdingsRecords}
        instanceId={instanceId}
      >
        {holdingsRecords.map(holding => (
          <DraggableHolding
            holding={holding}
            instanceId={instanceId}
            isHoldingsMovement={isHoldingsMovement}
          >
            {draggableProps => renderHolding(holding, draggableProps)}
          </DraggableHolding>
        ))}
      </DraggableHoldingsList>
    );
  }

  return holdingsRecords.map(holding => renderHolding(holding));
};

HoldingsList.propTypes = {
  instanceId: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  isItemsMovement: PropTypes.bool,
  isHoldingsMovement: PropTypes.bool,
};

export default HoldingsList;
