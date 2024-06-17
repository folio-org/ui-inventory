import { useOkapiKy } from '@folio/stripes/core';
import { OKAPI_TENANT_HEADER } from '@folio/stripes-inventory-components';

const useTenantKy = ({ tenantId } = {}) => {
  const ky = useOkapiKy();

  return tenantId
    ? ky.extend({
      hooks: {
        beforeRequest: [
          request => {
            request.headers.set(OKAPI_TENANT_HEADER, tenantId);
          },
        ],
      },
    })
    : ky;
};

export default useTenantKy;
