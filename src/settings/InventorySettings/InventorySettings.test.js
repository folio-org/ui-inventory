import {
  useStripes,
  useUserTenantPermissions,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import InventorySettings from './InventorySettings';
import { useAuditSettings } from '../../hooks';
import * as utils from '../../utils';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  Settings: jest.fn(() => <div>Settings</div>),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAuditSettings: jest.fn().mockReturnValue({
    settings: [{
      key: 'enabled',
      value: true,
    }],
    isSettingsLoading: false,
  }),
}));

const spyOnIsUserInConsortiumMode = jest.spyOn(utils, 'isUserInConsortiumMode');

const renderInventorySettings = (props = {}) => renderWithIntl(
  <InventorySettings {...props} />,
  translationsProperties
);

describe('InventorySettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when consortium data is not loaded', () => {
    beforeEach(() => {
      spyOnIsUserInConsortiumMode.mockReturnValue(true);
    });

    it('should show a loading pane', () => {
      useStripes.mockReturnValueOnce({
        user: {
          user: {
            consortium: null,
          },
        },
      });

      const { getByText } = renderInventorySettings();

      expect(getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('when a user is in a member tenant and central permissions are not loaded', () => {
    it('should show a loading pane', () => {
      useUserTenantPermissions.mockReturnValue({
        isFetched: false,
      });

      const { getByText } = renderInventorySettings();

      expect(getByText('LoadingPane')).toBeInTheDocument();
    });
  });

  describe('when a user is in a central tenant', () => {
    it('should not wait for central tenant permissions and render settings', () => {
      useUserTenantPermissions.mockReturnValue({
        isFetched: false,
      });
      checkIfUserInMemberTenant.mockReturnValue(false);

      const { getByText } = renderInventorySettings();

      expect(getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('when non-consortia', () => {
    it('should display "Classification Browse" settings', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(false);
      checkIfUserInMemberTenant.mockReturnValue(false);
      useUserTenantPermissions.mockReturnValue({
        userPermissions: [],
        isFetched: false,
        isFetching: false,
        isLoading: false,
      });

      renderInventorySettings();

      const expectedProps = {
        sections: expect.arrayContaining([
          expect.objectContaining({
            pages: expect.arrayContaining([
              expect.objectContaining({
                route: 'classificationBrowse',
                perm: 'ui-inventory.settings.classification-browse',
              }),
            ]),
          }),
        ]),
      };

      expect(Settings).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('when version history is disabled', () => {
    beforeEach(async () => {
      useAuditSettings.mockClear().mockReturnValue({
        settings: [{
          key: 'enabled',
          value: false,
        }],
        isSettingsLoading: false,
      });

      renderInventorySettings();
    });

    it('should not show the version history setting', () => {
      const sectionsProp = Settings.mock.calls[0][0].sections;

      expect(sectionsProp).not.toEqual(expect.arrayContaining([
        expect.objectContaining({
          pages: expect.arrayContaining([
            expect.objectContaining({
              route: 'cardsPerPage',
            })
          ])
        })
      ]));
    });
  });
});
