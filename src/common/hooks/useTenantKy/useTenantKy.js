import { useOkapiKy } from '@folio/stripes/core';

import { extendKyWithTenant } from '../../../Instance/utils';

const useTenantKy = ({ tenantId } = {}) => {
  const ky = useOkapiKy();

  return tenantId ? extendKyWithTenant(ky, tenantId) : ky;
};

export default useTenantKy;
