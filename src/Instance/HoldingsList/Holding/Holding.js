import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  useCallout,
  useStripes,
} from '@folio/stripes/core';

import HoldingAccordion from './HoldingAccordion';

import {
  navigateToHoldingsViewPage,
  navigateToItemCreatePage,
} from '../../utils';
import { sendCalloutOnAffiliationChange } from '../../../utils';
import ItemsList from '../../ItemsList/ItemsList';
import { useMoveItemsContext } from '../../../contexts';

const Holding = ({
  id,
  holding,
  holdings,
  instance,
  tenantId,
  setItemsToHolding,
  pathToAccordionsState,
  isBarcodeAsHotlink,
  items,
  showViewHoldingsButton,
  showAddItemButton,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const callout = useCallout();

  const { isMoving } = useMoveItemsContext();

  const onViewHolding = useCallback(() => {
    navigateToHoldingsViewPage(history, location, instance, holding, tenantId, stripes.okapi.tenant);

    sendCalloutOnAffiliationChange(stripes, tenantId, callout);
  }, [location.search, instance.id, holding.id]);

  const onAddItem = useCallback(() => {
    navigateToItemCreatePage(history, location, instance, holding, tenantId, stripes.okapi.tenant);
  }, [location.search, instance.id, holding.id]);

  return (
    <HoldingAccordion
      withMoveDropdown={isMoving}
      holding={holding}
      holdings={holdings}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
      tenantId={tenantId}
      instanceId={instance.id}
      pathToAccordionsState={pathToAccordionsState}
      showViewHoldingsButton={showViewHoldingsButton}
      showAddItemButton={showAddItemButton}
    >
      <ItemsList
        id={id}
        contentData={items}
        holding={holding}
        tenantId={tenantId}
        setItemsToHolding={setItemsToHolding}
        isBarcodeAsHotlink={isBarcodeAsHotlink}
      />
    </HoldingAccordion>
  );
};

export default Holding;
