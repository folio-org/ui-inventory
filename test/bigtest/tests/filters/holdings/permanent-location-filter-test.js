import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('Holdings pane permanent location filter', () => {
  setupApplication({ scenarios: ['holdings-filters'] });

  const holdingsRoute = new HoldingsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory?segment=holdings');
  });

  describe('open permanent location filter', () => {
    beforeEach(async () => {
      await holdingsRoute.permLocationFilter.open();
    });

    it('displays the permanent location multi select', () => {
      expect(holdingsRoute.permLocationFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
