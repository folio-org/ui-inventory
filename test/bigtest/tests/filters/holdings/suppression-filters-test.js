import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('Holdings suppression filters', () => {
  setupApplication({ scenarios: ['holdings-filters'] });

  const holdingsRoute = new HoldingsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/holdings');
  });

  it('has a filter for staff-suppressed items', () => {
    expect(holdingsRoute.isStaffSuppressFilterPresent).to.equal(true);
  });

  it('has a filter for discovery-suppressed items', () => {
    expect(holdingsRoute.isDiscoverySuppressFilterPresent).to.equal(true);
  });
});
