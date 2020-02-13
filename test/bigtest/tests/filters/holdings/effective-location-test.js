import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('Holdings pane effective location filter', () => {
  setupApplication({ scenarios: ['holdings-filters'] });

  const holdingsRoute = new HoldingsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory?segment=holdings');
  });

  describe('open effective location filter', () => {
    beforeEach(async () => {
      await holdingsRoute.effectiveLocationFilter.open();
    });

    it('displays the effective location multi select', () => {
      expect(holdingsRoute.effectiveLocationFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
