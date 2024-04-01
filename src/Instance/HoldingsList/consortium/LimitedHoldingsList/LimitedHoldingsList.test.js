import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import LimitedHoldingsList from './LimitedHoldingsList';

jest.mock('../LimitedHolding', () => ({
  ...jest.requireActual('../LimitedHolding'),
  LimitedHolding: () => <div>LimitedHolding</div>,
}));

const userTenantLimitedPermissions = [{
  tenantId: 'college',
  permissionNames: [],
}];
const holdings = [{
  id: 'holdingsId1',
  callNumberPrefix: 'prefix',
  callNumber: 'callNumber',
  copyNumber: 'copyNumber',
}, {
  id: 'holdingsId2',
}, {
  id: 'holdingsId3',
}];

const renderLimitedHoldingsList = () => {
  const component = (
    <LimitedHoldingsList
      instance={{ id: 'instanceId' }}
      holdings={holdings}
      tenantId="college"
      userTenantPermissions={userTenantLimitedPermissions}
      pathToAccordionsState={[]}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LimitedHoldingsList', () => {
  it('should render holdings list', () => {
    renderLimitedHoldingsList();

    expect(screen.getAllByText('LimitedHolding').length).toEqual(3);
  });
});
