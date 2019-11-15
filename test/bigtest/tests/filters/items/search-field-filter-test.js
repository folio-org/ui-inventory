import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('Items SearchFieldFilter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/items');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await itemsRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await itemsRoute.searchFieldFilter.searchField.fillInput('(title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari")');
        await itemsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await itemsRoute.searchFieldFilter.searchField.fillInput('(title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari") sortby title');
        await itemsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });
  });
});
