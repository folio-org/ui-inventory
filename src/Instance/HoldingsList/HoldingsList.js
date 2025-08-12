import {
  useEffect,
} from 'react';
import { isEqual } from 'lodash';

import { Loading } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { Holding } from './Holding';

import { useInstanceHoldingsQuery } from '../../providers';
import { useMoveItemsContext } from '../../contexts';

const HoldingsList = ({
  instance,
  tenantId,
  isItemsMovement,
  pathToAccordionsState,
}) => {
  const stripes = useStripes();
  const { holdingsRecords, isLoading } = useInstanceHoldingsQuery(instance.id, { tenantId });

  const canViewHoldingsAndItems = stripes.hasPerm('ui-inventory.instance.view');
  const canCreateItem = stripes.hasPerm('ui-inventory.item.create');

  const {
    setIsMoving,
    holdingsWithItems,
    setHoldingsWithItems,
  } = useMoveItemsContext();

  useEffect(() => {
    setIsMoving(isItemsMovement);
  }, [isItemsMovement]);

  useEffect(() => {
    if (holdingsRecords?.length && !isLoading) {
      setHoldingsWithItems(holdingsRecords.map(({ id }) => ({ id })));
    }
  }, [holdingsRecords, instance, setHoldingsWithItems, isLoading]);

  const setItemsToHolding = (holdingId, items = []) => {
    const holdingElements = holdingsWithItems.find(({ id }) => id === holdingId);

    if (!isEqual(holdingElements?.items, items)) {
      setHoldingsWithItems(prevHoldings => {
        return prevHoldings.map(hldng => (hldng.id === holdingId ? { ...hldng, items } : hldng));
      });
    }
  };

  if (isLoading) return <Loading size="large" />;

  return (
    <>
      {holdingsRecords.map(holding => (
        <Holding
          key={holding.id}
          id={holding.id}
          holding={holding}
          holdings={holdingsRecords}
          instance={instance}
          tenantId={tenantId}
          pathToAccordionsState={pathToAccordionsState}
          setItemsToHolding={setItemsToHolding}
          items={holdingsWithItems.find(hld => hld.id === holding.id)?.items || []}
          showViewHoldingsButton={canViewHoldingsAndItems}
          showAddItemButton={canCreateItem}
          isBarcodeAsHotlink={canViewHoldingsAndItems}
        />
      ))}
    </>
  );
};

export default HoldingsList;
