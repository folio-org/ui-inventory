import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('Holdings SearchFieldFilter', () => {
  setupApplication({ scenarios: ['holdings-filters'] });

  const holdingsRoute = new HoldingsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/holdings');
  });

  describe('Query Search', () => {
    beforeEach(async () => {
      await holdingsRoute.searchFieldFilter.searchField.selectIndex('Query search');
    });

    describe('search without sortby', () => {
      beforeEach(async () => {
        await holdingsRoute.searchFieldFilter.searchField.fillInput('(title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari")');
        await holdingsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(holdingsRoute.rows().length).to.equal(1);
      });
    });

    describe('search with sortby', () => {
      beforeEach(async () => {
        await holdingsRoute.searchFieldFilter.searchField.fillInput('(title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari") sortby title');
        await holdingsRoute.searchFieldFilter.clickSearch();
      });

      it('finds instances by title and contributor name', () => {
        expect(holdingsRoute.rows().length).to.equal(1);
      });
    });
  });
});
