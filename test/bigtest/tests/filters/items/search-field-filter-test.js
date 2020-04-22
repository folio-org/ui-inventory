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
    this.visit('/inventory?segment=items');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await itemsRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await itemsRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval)');
        await itemsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await itemsRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval) sortby title');
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

  describe('Call number, eye readable', function () {
    beforeEach(async function () {
      const instance = this.server.create('instance', {}, 'withHoldingAndItem');
      const item = instance.holdings.models[0].items.models[0];

      await itemsRoute.searchFieldFilter.searchField.selectIndex('Effective call number (item), eye readable');
      await itemsRoute.searchFieldFilter.searchField.fillInput(item.callNumber);
      await itemsRoute.searchFieldFilter.clickSearch();
    });

    it('finds instances by call number (item), eye readable', () => {
      expect(itemsRoute.rows().length).to.equal(1);
    });
  });

  describe('selecting the "ISBN, normalized" search option', function () {
    beforeEach(async function () {
      const isbnIdentifierType = this.server.create('identifier-type', { name: 'ISBN' });
      const invalidIsbnIdentifierType = this.server.create('identifier-type', { name: 'Invalid ISBN' });

      this.server.create('instance', {
        title: 'Homo Deus: A Brief History of Tomorrow',
        contributors: [{ name: 'Yuval Noah Harari' }],
        identifiers: [
          { identifierTypeId: isbnIdentifierType.id, value: ' 1-2 345- (pbk. 3 )' },
          { identifierTypeId: invalidIsbnIdentifierType.id, value: '66-777 88-999' },
        ],
      }, 'withHoldingAndItem');

      await itemsRoute.searchFieldFilter.searchField.selectIndex('ISBN, normalized');
      await itemsRoute.searchFieldFilter.searchField.fillInput('12345');
      await itemsRoute.searchFieldFilter.clickSearch();
    });

    it('should find instances by normalized isbn', () => {
      expect(itemsRoute.rows().length).to.equal(1);
    });
  });
});
