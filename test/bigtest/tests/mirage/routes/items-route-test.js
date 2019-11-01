import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('ItemsRoute', () => {
  setupApplication();

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(async function () {
    this.visit('/inventory/items');
  });

  it('opens items route', () => {
    expect(itemsRoute.isPresent).to.equal(true);
  });

  describe('material type filter', () => {
    it('displays material type filter', () => {
      expect(itemsRoute.materialTypeFilter.isPresent).to.equal(true);
    });
  });
});
