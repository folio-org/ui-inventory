import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  useUserTenantPermissions
} from '@folio/stripes/core';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import { renderWithIntl, translationsProperties } from '../test/jest/helpers';
import ViewInstanceWrapper from './ViewInstanceWrapper';
import ViewInstance from './ViewInstance';
import {
  useInstanceMutation,
} from './hooks';
import { useInstance } from './common';
import {
  CONSORTIUM_PREFIX,
  SOURCE_VALUES,
} from './constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
}));
jest.mock('./ViewInstance', () => jest.fn(() => <div>ViewInstance</div>));

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useInstanceMutation: jest.fn(),
  useUserTenantPermissions: jest.fn(),
}));
jest.mock('./common', () => ({
  ...jest.requireActual('./common'),
  useInstance: jest.fn(),
}));

const match = {
  params : {
    id : '001'
  },
};

const renderViewInstanceWrapper = (props = {}) => renderWithIntl(
  <MemoryRouter>
    <ViewInstanceWrapper
      resources={{}}
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
    useInstanceMutation.mockReturnValue({ mutateInstance: () => {} });
    useUserTenantPermissions.mockReturnValue({
      userPermissions: [],
      isFetching: false,
    });
    useInstance.mockReturnValue({
      instance: {
        id: match.params.id,
        source: SOURCE_VALUES.MARC,
        shared: false,
        tenantId: 'tenantId',
      },
      isLoading: false,
    });
  });

  describe('when record is shared and user in member tenant and there are both userId and centralTenantId', () => {
    it('should fetch the central tenant permissions', () => {
      const userPermissions = [{
        permissionName: 'ui-quick-marc.quick-marc-editor.all',
        subPermissions: ['ui-inventory.instance.create'],
      }, {
        permissionName: 'ui-inventory.instance.create',
        subPermissions: [],
      }];
      const flattenUserPermissions = new Set(['ui-quick-marc.quick-marc-editor.all', 'ui-inventory.instance.create']);

      useInstance.mockReturnValue({
        instance: {
          id: match.params.id,
          source: `${CONSORTIUM_PREFIX}MARC`,
          shared: true,
          tenantId: 'tenantId',
        },
        isLoading: false,
      });
      useUserTenantPermissions.mockReturnValue({
        userPermissions,
        isFetching: false,
      });

      renderViewInstanceWrapper();

      expect(useUserTenantPermissions).toHaveBeenCalledWith({
        tenantId: 'consortia',
      }, {
        enabled: true,
      });

      expect(ViewInstance.mock.calls[0][0].centralTenantPermissions).toEqual(flattenUserPermissions);
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
