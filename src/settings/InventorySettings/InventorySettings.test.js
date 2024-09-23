import {
  useStripes,
  useUserTenantPermissions,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import InventorySettings from './InventorySettings';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  Settings: () => <div>Settings</div>
}));

const renderInventorySettings = (props = {}) => renderWithIntl(
  <InventorySettings {...props} />,
  translationsProperties
);

describe('InventorySettings', () => {
  describe('when consortium data is not loaded', () => {
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
});
