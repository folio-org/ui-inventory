import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../../../constants';
import useTenantKy from './useTenantKy';

const reqMock = {
  headers: {
    set: jest.fn(),
  },
};
const kyMock = {
  extend: jest.fn(({ hooks: { beforeRequest } }) => {
    beforeRequest[0](reqMock);

    return kyMock;
  }),
};

describe('useTenantKy', () => {
  beforeEach(() => {
    reqMock.headers.set.mockClear();
    kyMock.extend.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should set provided okapi tenant header and return \'ky\' client', async () => {
    const tenantId = 'college';
    const { result } = renderHook(() => useTenantKy({ tenantId }));

    expect(result.current).toBe(kyMock);
    expect(reqMock.headers.set).toHaveBeenCalledWith(OKAPI_TENANT_HEADER, tenantId);
  });

  it('should use current tenant in the headers if there is no provided tenant ID', async () => {
    const { result } = renderHook(() => useTenantKy());

    expect(result.current).toBe(kyMock);
    expect(reqMock.headers.set).not.toHaveBeenCalled();
  });
});
