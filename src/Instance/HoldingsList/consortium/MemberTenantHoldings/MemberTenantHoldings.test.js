import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { instance } from '../../../../../test/fixtures';

import MemberTenantHoldings from './MemberTenantHoldings';

jest.mock('../../../../hooks/useMemberTenantHoldings', () => () => ({ holdings: [{}], isLoading: false }));
jest.mock('../../HoldingsList', () => () => <>Holdings</>);
jest.mock('../LimitedHoldingsList', () => ({
  ...jest.requireActual('../LimitedHoldingsList'),
  LimitedHoldingsList: () => <>LimitedHoldingsList</>,
}));
jest.mock('../../../../dnd/DragAndDropProvider', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));

const mockMemberTenant = {
  id: 'college',
  name: 'College',
};

const userTenantFullPermissions = [{
  tenantId: 'college',
  permissionNames: [{
    permissionName: 'ui-inventory.holdings.create',
    subPermissions: ['test subPermission 1']
  }, {
    permissionName: 'ui-inventory.instance.view',
    subPermissions: ['test subPermission 1']
  }, {
    permissionName: 'ui-inventory.item.create',
    subPermissions: ['test subPermission 1']
  }],
}];

const userTenantLimitedPermissions = [{
  tenantId: 'college',
  permissionNames: [],
}];

const renderMemberTenantHoldings = ({ userTenantPermissions }) => {
  const component = (
    <Router>
      <MemberTenantHoldings
        instance={instance}
        memberTenant={mockMemberTenant}
        userTenantPermissions={userTenantPermissions}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MemberTenantHoldings', () => {
  it('should render member tenant accordion', () => {
    renderMemberTenantHoldings({ userTenantPermissions: userTenantFullPermissions });

    expect(screen.getByText('College')).toBeInTheDocument();
  });

  describe('tenant with inventory permissions', () => {
    it('should render member tenant\'s holdings', () => {
      renderMemberTenantHoldings({ userTenantPermissions: userTenantFullPermissions });

      expect(screen.getByText('Holdings')).toBeInTheDocument();
    });
  });

  describe('tenant with limited permissions', () => {
    it('should render member tenant\'s holdings with limited information', () => {
      renderMemberTenantHoldings({ userTenantPermissions: userTenantLimitedPermissions });

      expect(screen.getByText('LimitedHoldingsList')).toBeInTheDocument();
    });
  });

  it('should render Add holdings button', () => {
    renderMemberTenantHoldings({ userTenantPermissions: userTenantFullPermissions });

    expect(screen.getByRole('button', { name: 'Add holdings' })).toBeInTheDocument();
  });
});
