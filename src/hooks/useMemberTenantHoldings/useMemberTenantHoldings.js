import { useMemo } from 'react';

import { useInstanceHoldingsQuery } from '../../providers';
import useConsortiumHoldings from '../useConsortiumHoldings';

import { hasMemberTenantPermission } from '../../utils';

const useMemberTenantHoldings = (instance, tenantId, userTenantPermissions) => {
  const canViewHoldings = hasMemberTenantPermission('inventory-storage.holdings.collection.get', tenantId, userTenantPermissions);

  const { holdingsRecords: expandedHoldings, isLoading: isExpandedHoldingsLoading } = useInstanceHoldingsQuery(instance?.id, { tenantId, enabled: canViewHoldings });
  const { holdings: limitedHoldings, isLoading: isLimitedHoldingsLoading } = useConsortiumHoldings(instance?.id, tenantId, { enabled: !canViewHoldings });

  const holdings = useMemo(
    () => (expandedHoldings?.length ? expandedHoldings : limitedHoldings?.length ? limitedHoldings : []),
    [expandedHoldings, limitedHoldings, isExpandedHoldingsLoading, isLimitedHoldingsLoading],
  );
  const isLoading = useMemo(
    () => isExpandedHoldingsLoading || isLimitedHoldingsLoading,
    [isExpandedHoldingsLoading, isLimitedHoldingsLoading],
  );

  return {
    holdings,
    isLoading,
  };
};

export default useMemberTenantHoldings;
