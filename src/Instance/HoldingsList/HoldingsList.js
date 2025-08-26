import {
  useEffect,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { Holding } from './Holding';

import { useInstanceHoldingsQuery } from '../../providers';
import {
  DropZone,
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

  const { holdingsRecords = [], isLoading } = useInstanceHoldingsQuery(instanceId, { tenantId });
  const canViewHoldingsAndItems = stripes.hasPerm('ui-inventory.instance.view');
  const canCreateItem = stripes.hasPerm('ui-inventory.item.create');

  const state = useInventoryState();
  const actions = useInventoryActions();

  useEffect(() => {
    if (!holdings.length && holdingsRecords?.length && !isLoading) {
      actions.setHoldings(holdingsRecords);
    }
  }, [holdingsRecords, isLoading, instanceId]);

  const getItemsContent = holdingId => state.holdings[holdingId]?.itemIds.map(id => state.items[id]) || [];
  const holdingsContent = useMemo(() => {
    return holdings.length ? holdings : holdingsRecords;
  }, [holdings, holdingsRecords]);

  if (isLoading) return <Loading size="large" />;

  return (
    <div>
      {holdingsContent.map(holding => (
        <Holding
          key={holding.id}
          id={holding.id}
          holding={holding}
          holdings={holdingsContent}
          items={getItemsContent(holding.id)}
          instanceId={instanceId}
          tenantId={tenantId}
          pathToAccordionsState={pathToAccordionsState}
          showViewHoldingsButton={canViewHoldingsAndItems}
          showAddItemButton={canCreateItem}
          isBarcodeAsHotlink={canViewHoldingsAndItems}
          isItemsMovement={isItemsMovement}
          isHoldingsMovement={isHoldingsMovement}
        />
      ))}
      {!holdingsContent.length && isHoldingsMovement && (
        <DropZone>
          <FormattedMessage id="ui-inventory.moveItems.instance.dropZone" />
        </DropZone>
      )}
    </div>
  );
};

HoldingsList.propTypes = {
  instanceId: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  isItemsMovement: PropTypes.bool,
  isHoldingsMovement: PropTypes.bool,
};

export default HoldingsList;
