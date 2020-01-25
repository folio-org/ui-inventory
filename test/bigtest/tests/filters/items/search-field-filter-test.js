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

  const itemHRID = 'it00000000005';

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

  describe('selecting the Item HRID search option', function () {
    beforeEach(async () => {
      await itemsRoute.searchFieldFilter.searchField.selectIndex('Item HRID');
      await itemsRoute.searchFieldFilter.searchField.fillInput(itemHRID);
      await itemsRoute.searchFieldFilter.clickSearch();
    });

    it('should reflect the Item HRID in the URL query params', () => {
      expect(this.ctx.location.search).to.include('qindex=hrid');
      expect(this.ctx.location.search).to.include(`query=${itemHRID}`);
    });

    it('should find instance by Item HRID', () => {
      expect(itemsRoute.rows().length).to.equal(1);
    });

    describe('filling the search field with incorrect hrid', function () {
      beforeEach(async () => {
        await itemsRoute.searchFieldFilter.searchField.fillInput('incorrect value');
        await itemsRoute.searchFieldFilter.clickSearch();
      });

      it('should not find an instance with given Item HRID', () => {
        expect(itemsRoute.rows().length).to.equal(0);
      });
    });
  });
});
