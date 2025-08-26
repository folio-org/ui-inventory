import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import { Accordion } from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import { LimitedItemsList } from '../../../ItemsList/consortium';
import {
  HoldingAccordionLabel,
  ViewHoldingsButton,
  AddItemButton,
  ItemsCountBadge,
} from '../../Holding';
import { useConsortiumItems } from '../../../../hooks';

import { hasMemberTenantPermission } from '../../../../utils';
import {
  navigateToHoldingsViewPage,
  navigateToItemCreatePage,
} from '../../../utils';

const LimitedHolding = ({
  instance,
  holding,
  tenantId,
  locationName,
  userTenantPermissions,
  pathToAccordionsState,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);
  const instanceId = instance.id;

  const pathToAccordion = [...pathToAccordionsState, holding?.id];
  const accId = pathToAccordion.join('.');

  const canViewHoldingsAndItems = hasMemberTenantPermission('ui-inventory.instance.view', tenantId, userTenantPermissions);
  const canCreateItem = hasMemberTenantPermission('ui-inventory.item.create', tenantId, userTenantPermissions);

  const { totalRecords: itemCount } = useConsortiumItems(instance.id, holding.id, tenantId, { searchParams: { limit: 0 } });

  const onViewHolding = useCallback(() => {
    navigateToHoldingsViewPage(history, location, instanceId, holding, tenantId, stripes.okapi.tenant);
  }, [location.search, instanceId, holding.id]);

  const onAddItem = useCallback(() => {
    navigateToItemCreatePage(history, location, instanceId, holding, tenantId, stripes.okapi.tenant);
  }, [location.search, instanceId, holding.id]);

  const accordionLabel = (
    <HoldingAccordionLabel
      location={locationName}
      holding={holding}
    />
  );

  const renderHoldingsButtons = (isOpen) => {
    return (
      <>
        {canViewHoldingsAndItems && (
          <ViewHoldingsButton
            holding={holding}
            tenantId={tenantId}
            onViewHolding={onViewHolding}
          />
        )}
        {!isUserInCentralTenant && canCreateItem && (
          <AddItemButton
            holding={holding}
            tenantId={tenantId}
            onAddItem={onAddItem}
          />
        )}
        {!isOpen && <ItemsCountBadge itemCount={itemCount} />}
      </>
    );
  };

  return (
    <Accordion
      id={accId}
      label={accordionLabel}
      displayWhenClosed={renderHoldingsButtons(false)}
      displayWhenOpen={renderHoldingsButtons(true)}
      closedByDefault
    >
      <LimitedItemsList
        instance={instance}
        holding={holding}
        tenantId={tenantId}
        userTenantPermissions={userTenantPermissions}
      />
    </Accordion>
  );
};

LimitedHolding.propTypes = {
  instance: PropTypes.object.isRequired,
  holding: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  locationName: PropTypes.string.isRequired,
  userTenantPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pathToAccordionsState: PropTypes.arrayOf(PropTypes.string),
};

export default LimitedHolding;
