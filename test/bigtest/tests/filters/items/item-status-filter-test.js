import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('ItemStatusFilter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory?segment=items');
  });

  describe('open item status filter', () => {
    beforeEach(async () => {
      await itemsRoute.itemStatusFilter.open();
    });

    it('displays item status multiselect', () => {
      expect(itemsRoute.itemStatusFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
