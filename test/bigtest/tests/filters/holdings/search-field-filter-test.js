import { expect } from 'chai';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('Holdings SearchFieldFilter', () => {
  setupApplication({ scenarios: ['holdings-filters'] });

  const holdingsRoute = new HoldingsRouteInteractor();

  const holdingHRID = 'ho00000000002';

  beforeEach(function () {
    this.visit('/inventory?segment=holdings');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await holdingsRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await holdingsRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval)');
        await holdingsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(holdingsRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await holdingsRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval) sortby title');
        await holdingsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(holdingsRoute.rows().length).to.equal(1);
      });
    });
  });

  describe('ISBN', function () {
    beforeEach(async () => {
      await holdingsRoute.searchFieldFilter.searchField.selectIndex('ISBN');
      await holdingsRoute.searchFieldFilter.searchField.fillInput('isbn');
      await holdingsRoute.searchFieldFilter.clickSearch();
    });

    it('finds instances by isbn', () => {
      expect(holdingsRoute.rows().length).to.equal(1);
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

      await holdingsRoute.searchFieldFilter.searchField.selectIndex('ISBN, normalized');
      await holdingsRoute.searchFieldFilter.searchField.fillInput('6677788999');
      await holdingsRoute.searchFieldFilter.clickSearch();
    });

    it('should find instances by normalized isbn', () => {
      expect(holdingsRoute.rows().length).to.equal(1);
    });
  });

  describe('Call number, eye readable', function () {
    beforeEach(async function () {
      const instance = this.server.create('instance', {}, 'withHoldingAndItem');

      await holdingsRoute.searchFieldFilter.searchField.selectIndex('Call number, eye readable');
      await holdingsRoute.searchFieldFilter.searchField.fillInput(instance.holdings.models[0].callNumber);
      await holdingsRoute.searchFieldFilter.clickSearch();
    });

    it('finds instances by Call number - eye readable', () => {
      expect(holdingsRoute.rows().length).to.equal(1);
    });
  });

  describe('selecting the Holdings HRID search option', function () {
    beforeEach(async () => {
      await holdingsRoute.searchFieldFilter.searchField.selectIndex('Holdings HRID');
      await holdingsRoute.searchFieldFilter.searchField.fillInput(holdingHRID);
      await holdingsRoute.searchFieldFilter.clickSearch();
    });

    it('should reflect the Holdings HRID in the URL query params', () => {
      expect(this.ctx.location.search).to.include('qindex=hrid');
      expect(this.ctx.location.search).to.include(`query=${holdingHRID}`);
    });

    it('should find instance by Holdings HRID', () => {
      expect(holdingsRoute.rows().length).to.equal(1);
    });

    describe('filling the search field with incorrect hrid', function () {
      beforeEach(async () => {
        await holdingsRoute.searchFieldFilter.searchField.fillInput('incorrect value');
        await holdingsRoute.searchFieldFilter.clickSearch();
      });

      it('should not find an instance with given Holdings HRID', () => {
        expect(holdingsRoute.rows().length).to.equal(0);
      });
    });
  });
});
