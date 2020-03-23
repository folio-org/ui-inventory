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

  describe('choose item status', () => {
    beforeEach(async () => {
      await itemsRoute.itemStatusFilter.checkboxes.dataOptions(6).click();
    });

    it('finds instances by chosen item status', () => {
      expect(itemsRoute.rows().length).to.equal(1);
    });

    describe('clear item status filter', () => {
      beforeEach(async () => {
        await itemsRoute.itemStatusFilter.clear();
      });

      it('clears instances', () => {
        expect(itemsRoute.rows().length).to.equal(0);
      });
    });
  });
});
