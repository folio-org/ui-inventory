import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { instance } from '../../../../test/fixtures';

import MemberTenantHoldings from './MemberTenantHoldings';

jest.mock('../../../providers', () => ({
  ...jest.requireActual('../../../providers'),
  useInstanceHoldingsQuery: () => ({ holdingsRecords: [{ id: 'holdings-id' }] }),
}));
jest.mock('../../HoldingsList', () => ({
  ...jest.requireActual('../../HoldingsList'),
  HoldingsList: () => <>Holdings</>,
}));

const mockMemberTenant = {
  id: 'college',
  name: 'College',
};

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
  it('should render member tenant accordion', () => {
    renderMemberTenantHoldings();

    expect(screen.getByText('College')).toBeInTheDocument();
  });

  it('should render member tenant\'s holdings', () => {
    renderMemberTenantHoldings();

    expect(screen.getByText('Holdings')).toBeInTheDocument();
  });

  it('should render Add holdings button', () => {
    renderMemberTenantHoldings();

    expect(screen.getByRole('button', { name: 'Add holdings' })).toBeInTheDocument();
  });
});
