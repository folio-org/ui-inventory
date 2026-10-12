import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import LimitedItemsList from './LimitedItemsList';

jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useConsortiumItems: jest.fn(() => ({ items: [{ barcode: '111' }], totalRecords: 6, isFetching: false })),
}));

const userTenantLimitedPermissions = [{
  tenantId: 'college',
  permissionNames: [],
}];
const holding = {
  id: 'holdingsId1',
  callNumberPrefix: 'prefix',
  callNumber: 'callNumber',
  copyNumber: 'copyNumber',
};

const renderLimitedItemsList = () => {
  const component = (
    <Router>
      <LimitedItemsList
        instance={{ id: 'instanceId' }}
        holding={holding}
        tenantId="college"
        userTenantPermissions={userTenantLimitedPermissions}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LimitedItemsList', () => {
  it('should render items list table', () => {
    renderLimitedItemsList();

    expect(screen.getByText('111')).toBeInTheDocument();
  });

  it('with correct columns', () => {
    renderLimitedItemsList();

    expect(screen.getByText(/item: barcode/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/copy number/i)).toBeInTheDocument();
    expect(screen.getByText(/loan type/i)).toBeInTheDocument();
    expect(screen.getByText(/effective location/i)).toBeInTheDocument();
    expect(screen.getByText(/enumeration/i)).toBeInTheDocument();
    expect(screen.getByText(/chronology/i)).toBeInTheDocument();
    expect(screen.getByText(/volume/i)).toBeInTheDocument();
    expect(screen.getByText(/year, caption/i)).toBeInTheDocument();
    expect(screen.getByText(/material type/i)).toBeInTheDocument();
  });
});
