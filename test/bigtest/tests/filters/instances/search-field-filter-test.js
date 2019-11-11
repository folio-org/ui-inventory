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
      await instancesRoute.searchFieldFilter.searchField.fillInput('title="Sapiens: A Brief History of Humankind" and contributors =/@name "Yuval Noah Harari"');
      await instancesRoute.searchFieldFilter.clickSearch();
    });

    it('finds instances by title and contributor name', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });
  });
});
