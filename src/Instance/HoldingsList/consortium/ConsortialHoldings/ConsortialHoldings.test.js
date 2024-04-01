import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { instance } from '../../../../../test/fixtures';

import { DataContext } from '../../../../contexts';
import ConsortialHoldings from './ConsortialHoldings';

jest.mock('../MemberTenantHoldings', () => ({
  ...jest.requireActual('../MemberTenantHoldings'),
  MemberTenantHoldings: ({ memberTenant }) => <>{memberTenant.name} accordion</>,
}));
jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useSearchForShadowInstanceTenants: () => ({ tenants: [{ id: 'college' }] }),
}));

const providerValue = {
  consortiaTenantsById: {
    'college': { id: 'college', name: 'College', isCentral: false },
  }
};

const renderConsortialHoldings = () => {
  const component = (
    <DataContext.Provider value={providerValue}>
      <ConsortialHoldings instance={instance} />
    </DataContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ConsortialHoldings', () => {
  it('should render Consortial holdings accordion', () => {
    renderConsortialHoldings();

    expect(screen.getByRole('button', { name: 'Consortial holdings' })).toBeInTheDocument();
  });

  it('should render sub-accordion with tenants\' holdings info', () => {
    renderConsortialHoldings();

    expect(screen.getByText('College accordion')).toBeInTheDocument();
  });
});
