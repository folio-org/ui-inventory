import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewInstanceWrapper from './ViewInstanceWrapper';
import ViewInstance from './ViewInstance';
import { useUserTenantPermissions } from './hooks';
import { CONSORTIUM_PREFIX } from './constants';

jest.mock('./ViewInstance', () => jest.fn(() => <div>ViewInstance</div>));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useUserTenantPermissions: jest.fn(),
}));

const resources = {
  instance : {
    records : [{
      type: 'okapi',
      path: 'inventory/instances/:{id}',
      resourceShouldRefresh: true,
      throwErrors: false,
    }],
  },
};

const match = {
  params : {
    id : '001'
  },
};

const renderViewInstanceWrapper = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <ViewInstanceWrapper
      resources={resources}
      match={match}
      stripes={buildStripes()}
      {...props}
    />
  </MemoryRouter>,
  translationsProperties
);

describe('ViewInstanceWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserTenantPermissions.mockReturnValue({
      userPermissions: [],
      isFetching: false,
    });
  });

  describe('when record is shared and user in member tenant and there are both userId and centralTenantId', () => {
    it('should fetch the central tenant permissions', () => {
      const userPermissions = [{
        permissionName: 'ui-quick-marc.quick-marc-editor.all',
      }];

      useUserTenantPermissions.mockReturnValue({
        userPermissions,
        isFetching: false,
      });

      renderViewInstanceWrapper({
        resources: {
          ...resources,
          instance : {
            records : [{
              source: `${CONSORTIUM_PREFIX}MARC`,
            }],
          },
        }
      });

      expect(useUserTenantPermissions).toHaveBeenCalledWith({
        tenantId: 'consortia',
        userId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      }, {
        enabled: true,
      });

      expect(ViewInstance.mock.calls[0][0].centralTenantPermissions).toEqual(userPermissions);
      expect(ViewInstance.mock.calls[0][0].isCentralTenantPermissionsLoading).toBeFalsy();
    });
  });

  describe('when record is not shared', () => {
    it('should not request the central tenant permissions', () => {
      renderViewInstanceWrapper();

      expect(useUserTenantPermissions).toHaveBeenCalledWith(expect.anything(), {
        enabled: false,
      });
    });
  });
});
