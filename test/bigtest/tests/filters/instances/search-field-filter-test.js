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

  beforeEach(function () {
    this.visit('/inventory');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await instancesRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await instancesRoute.searchFieldFilter.searchField.fillInput('title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari"');
        await instancesRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(instancesRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await instancesRoute.searchFieldFilter.searchField.fillInput('title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari" sortby title');
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
});
