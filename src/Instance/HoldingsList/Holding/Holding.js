import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  useCallout,
  useStripes,
} from '@folio/stripes/core';

import HoldingAccordion from './HoldingAccordion';
import { ItemsList } from '../../ItemsList';

import {
  navigateToHoldingsViewPage,
  navigateToItemCreatePage,
} from '../../utils';
import { sendCalloutOnAffiliationChange } from '../../../utils';

const Holding = ({
  id,
  holding,
  holdings,
  instanceId,
  tenantId,
  pathToAccordionsState,
  showViewHoldingsButton,
  showAddItemButton,
  isBarcodeAsHotlink,
  isItemsMovement = false,
  isHoldingsMovement = false,

  isHoldingSelected,
  onSelectHolding,
  attributes,
  listeners,
  setActivatorNodeRef,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const callout = useCallout();

  const onViewHolding = useCallback(() => {
    navigateToHoldingsViewPage(history, location, instanceId, holding, tenantId, stripes.okapi.tenant);

    sendCalloutOnAffiliationChange(stripes, tenantId, callout);
  }, [location.search, instanceId, holding.id]);

  const onAddItem = useCallback(() => {
    navigateToItemCreatePage(history, location, instanceId, holding, tenantId, stripes.okapi.tenant);
  }, [location.search, instanceId, holding.id]);

  return (
    <HoldingAccordion
      holding={holding}
      holdings={holdings}
      onViewHolding={onViewHolding}
      onAddItem={onAddItem}
      tenantId={tenantId}
      instanceId={instanceId}
      isHoldingSelected={isHoldingSelected}
      onSelectHolding={onSelectHolding}
      showViewHoldingsButton={showViewHoldingsButton}
      showAddItemButton={showAddItemButton}
      pathToAccordionsState={pathToAccordionsState}
      withMoveHoldingCheckbox={isHoldingsMovement}
      withMoveDropdown={isItemsMovement || isHoldingsMovement}
      dragHandleAttributes={attributes}
      dragHandleListeners={listeners}
      ref={setActivatorNodeRef}
    >
      <ItemsList
        id={id}
        instanceId={instanceId}
        holding={holding}
        tenantId={tenantId}
        isBarcodeAsHotlink={isBarcodeAsHotlink}
        isItemsMovement={isItemsMovement}
      />
    </HoldingAccordion>
  );
};

Holding.propTypes = {
  id: PropTypes.string,
  holding: PropTypes.object.isRequired,
  holdings: PropTypes.arrayOf(PropTypes.object).isRequired,
  instanceId: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
  showViewHoldingsButton: PropTypes.bool,
  showAddItemButton: PropTypes.bool,
  isBarcodeAsHotlink: PropTypes.bool,
  isItemsMovement: PropTypes.bool,
  isHoldingsMovement: PropTypes.bool,
};

export default Holding;
