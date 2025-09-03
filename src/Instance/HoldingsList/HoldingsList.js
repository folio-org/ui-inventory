import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import Holding from './Holding/Holding';
import DraggableHolding from './Holding/DraggableHolding';
import DraggableHoldingsList from './DraggableHoldingsList';

import { useInstanceHoldingsQuery } from '../../providers';
import {
  useInventoryActions,
  useInventoryState,
} from '../../dnd';

const HoldingsList = ({
  instanceId,
  tenantId,
  holdings = [],
  pathToAccordionsState,
  isItemsMovement = false,
  isHoldingsMovement = false,
}) => {
  const stripes = useStripes();
  const actions = useInventoryActions();
  const state = useInventoryState();

  const canViewHoldingsAndItems = stripes.hasPerm('ui-inventory.instance.view');
  const canCreateItem = stripes.hasPerm('ui-inventory.item.create');

  const { holdingsRecords = [], isLoading } = useInstanceHoldingsQuery(instanceId, { tenantId });

  useEffect(() => {
    if (!holdings.length && holdingsRecords?.length && !isLoading) {
      actions.setHoldings(holdingsRecords);
    }
  }, [holdingsRecords, isLoading, instanceId, actions.setHoldings]);

  const holdingsContent = useMemo(() => {
    return holdings.length ? holdings : state.instances[instanceId]?.holdingIds?.map(id => state.holdings[id]);
  }, [holdings, holdingsRecords]);

  const renderHolding = useCallback((holding, props = {}) => {
    return (
      <Holding
        key={holding.id}
        id={holding.id}
        holding={holding}
        holdings={holdingsContent}
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
    holdingsContent,
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
        holdingsContent={holdingsContent}
        instanceId={instanceId}
      >
        {holdingsContent.map(holding => (
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

  return holdingsContent.map(holding => renderHolding(holding));
};

HoldingsList.propTypes = {
  instanceId: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object),
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  isItemsMovement: PropTypes.bool,
  isHoldingsMovement: PropTypes.bool,
};

export default HoldingsList;
