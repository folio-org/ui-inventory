import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';

describe('SearchFieldFilter', () => {
  setupApplication({ scenarios: ['instances-filters'] });

  const instancesRoute = new InstancesRouteInteractor();

  const instanceHRID = 'in00000000009';

  beforeEach(function () {
    this.visit('/inventory');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await instancesRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await instancesRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval)');
        await instancesRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(instancesRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await instancesRoute.searchFieldFilter.searchField.fillInput('(title=Sapiens and contributors=Yuval) sortby title');
        await instancesRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(instancesRoute.rows().length).to.equal(1);
      });
    });
  });

  describe('ISBN', function () {
    beforeEach(async () => {
      await instancesRoute.searchFieldFilter.searchField.selectIndex('- ISBN');
      await instancesRoute.searchFieldFilter.searchField.fillInput('isbn');
      await instancesRoute.searchFieldFilter.clickSearch();
    });

    it('finds instances by isbn', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });
  });

  describe('selecting the Instance HRID search option', function () {
    beforeEach(async () => {
      await instancesRoute.searchFieldFilter.searchField.selectIndex('Instance HRID');
      await instancesRoute.searchFieldFilter.searchField.fillInput(instanceHRID);
      await instancesRoute.searchFieldFilter.clickSearch();
    });

    it('should reflect the Instance HRID in the URL query params', () => {
      expect(this.ctx.location.search).to.include('qindex=hrid');
      expect(this.ctx.location.search).to.include(`query=${instanceHRID}`);
    });

    it('should find instance by Instance HRID', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });

    describe('filling the search field with incorrect hrid', function () {
      beforeEach(async () => {
        await instancesRoute.searchFieldFilter.searchField.fillInput('incorrect value');
        await instancesRoute.searchFieldFilter.clickSearch();
      });

      it('should not find an instance with given Instance HRID', () => {
        expect(instancesRoute.rows().length).to.equal(0);
      });
    });
  });
});
