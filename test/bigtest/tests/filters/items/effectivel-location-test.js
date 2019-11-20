import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('Item pane effective location filter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/items');
  });

  describe('open effective location filter', () => {
    beforeEach(async () => {
      await itemsRoute.effectiveLocationFilter.open();
    });

    it('displays the effective location multi select', () => {
      expect(itemsRoute.effectiveLocationFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
