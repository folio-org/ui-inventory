import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { useUserTenantPermissions } from '@folio/stripes/core';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { instance } from '../../../../../test/fixtures';
import { useHoldingsFromStorage } from '../../../../hooks';

import MemberTenantHoldings from './MemberTenantHoldings';

jest.mock('../../../../hooks/useMemberTenantHoldings', () => () => ({ holdings: [{ id: 'holdingId' }], isLoading: false }));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useUserTenantPermissions: jest.fn().mockReturnValue({
    userPermissions: [],
    isFetching: false,
  }),
}));
jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useHoldingsFromStorage: jest.fn(),
}));
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

const accordionId = `${mockMemberTenant.id}.${instance.id}`;

const userTenantFullPermissions = [{
  permissionName: 'ui-inventory.holdings.create',
  subPermissions: ['test subPermission 1']
}, {
  permissionName: 'ui-inventory.instance.view',
  subPermissions: ['test subPermission 1']
}, {
  permissionName: 'ui-inventory.item.create',
  subPermissions: ['test subPermission 1']
}];

const renderMemberTenantHoldings = () => {
  const component = (
    <Router>
      <MemberTenantHoldings
        instance={instance}
        memberTenant={mockMemberTenant}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MemberTenantHoldings', () => {
  beforeEach(() => {
    useHoldingsFromStorage.mockClear().mockReturnValue(
      [{ [accordionId]: true }, jest.fn()]
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render member tenant accordion', () => {
    renderMemberTenantHoldings();

    expect(screen.getByText('College')).toBeInTheDocument();
  });

  describe('tenant with inventory permissions', () => {
    it('should render member tenant\'s holdings', () => {
      useUserTenantPermissions.mockClear().mockReturnValue({
        userPermissions: userTenantFullPermissions,
        isFetching: false,
      });

      renderMemberTenantHoldings();

      expect(screen.getByText('Holdings')).toBeInTheDocument();
    });
  });

  describe('tenant with limited permissions', () => {
    it('should render member tenant\'s holdings with limited information', () => {
      useUserTenantPermissions.mockClear().mockReturnValue({
        userPermissions: [],
        isFetching: false,
      });

      renderMemberTenantHoldings();

      expect(screen.getByText('LimitedHoldingsList')).toBeInTheDocument();
    });
  });

  it('should render Add holdings button', () => {
    useUserTenantPermissions.mockClear().mockReturnValue({
      userPermissions: userTenantFullPermissions,
      isFetching: false,
    });

    renderMemberTenantHoldings();

    expect(screen.getByRole('button', { name: 'Add holdings' })).toBeInTheDocument();
  });
});
