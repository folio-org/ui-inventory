import { BrowserRouter as Router } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import LimitedHolding from './LimitedHolding';

jest.mock('../../../../hooks', () => ({
  ...jest.requireActual('../../../../hooks'),
  useConsortiumItems: () => ({ totalRecords: 6 }),
}));
jest.mock('../../../ItemsList/consortium', () => ({
  ...jest.requireActual('../../../ItemsList/consortium'),
  LimitedItemsList: () => <>LimitedItemsList</>,
}));

const userTenantLimitedPermissions = [{
  tenantId: 'college',
  permissionNames: [],
}];
const holdingsWithLimitedInfo = {
  id: 'holdingsId',
  callNumberPrefix: 'prefix',
  callNumber: 'callNumber',
  copyNumber: 'copyNumber',
};

const renderLimitedHolding = () => {
  const component = (
    <Router>
      <LimitedHolding
        instance={{ id: 'instanceId' }}
        holding={holdingsWithLimitedInfo}
        tenantId="college"
        userTenantPermissions={userTenantLimitedPermissions}
        pathToAccordionsState={[]}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LimitedHolding', () => {
  it('should render correct holdings accordion', () => {
    renderLimitedHolding();

    expect(screen.getByRole('button', {
      name: /holdings: > prefix callnumber copynumber/i
    })).toBeInTheDocument();
  });

  it('should render disabled View holdings button', () => {
    renderLimitedHolding();

    const viewHoldingsButton = screen.getByRole('button', { name: /view holdings/i });

    expect(viewHoldingsButton).toBeInTheDocument();
    expect(viewHoldingsButton).toHaveAttribute('disabled');
  });

  it('should render items count badge', () => {
    renderLimitedHolding();

    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render items table', () => {
    renderLimitedHolding();

    expect(screen.getByText('LimitedItemsList')).toBeInTheDocument();
  });
});
