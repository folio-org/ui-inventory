import { useMemo } from 'react';
import { isEmpty } from 'lodash';

import { useStripes } from '@folio/stripes/core';

const useItemPermissions = (isSharedInstance, tenants) => {
  const stripes = useStripes();

  return useMemo(() => ({
    canEdit: stripes.hasPerm('ui-inventory.item.edit'),
    canCreate: stripes.hasPerm('ui-inventory.item.create'),
    canUpdateOwnership: stripes.hasPerm('consortia.inventory.update-ownership.item.post')
      && isSharedInstance
      && !isEmpty(tenants),
    canMarkAsMissing: stripes.hasPerm('ui-inventory.item.mark-as-missing.execute'),
    canMarkAsWithdrawn: stripes.hasPerm('ui-inventory.items.mark-withdrawn.execute'),
    canDelete: stripes.hasPerm('ui-inventory.item.delete'),
  }), [stripes, isSharedInstance, tenants]);
};

export default useItemPermissions;
