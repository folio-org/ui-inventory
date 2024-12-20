import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { DataContext } from '../../../../contexts';
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
  permanentLocationId: 'permanentLocationId_1',
}, {
  id: 'holdingsId2',
  permanentLocationId: 'permanentLocationId_2',
}, {
  id: 'holdingsId3',
  permanentLocationId: 'permanentLocationId_3',
}];

const providerValue = {
  locationsById: {
    permanentLocationId_1: { name: 'Location 1' },
    permanentLocationId_2: { name: 'Location 2' },
    permanentLocationId_3: { name: 'Location 3' },
  },
};

const renderLimitedHoldingsList = () => {
  const component = (
    <DataContext.Provider value={providerValue}>
      <LimitedHoldingsList
        instance={{ id: 'instanceId' }}
        holdings={holdings}
        tenantId="college"
        userTenantPermissions={userTenantLimitedPermissions}
        pathToAccordionsState={[]}
      />
    </DataContext.Provider>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LimitedHoldingsList', () => {
  it('should render holdings list', () => {
    renderLimitedHoldingsList();

    expect(screen.getAllByText('LimitedHolding').length).toEqual(3);
  });
});
