import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import ItemsRouteInteractor from '../../interactors/routes/items-route';

describe('ItemsRoute', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(async function () {
    this.visit('/inventory/items');
  });

  it('opens items route', () => {
    expect(itemsRoute.isPresent).to.equal(true);
  });

  describe('open material type filter', () => {
    beforeEach(async function () {
      await itemsRoute.openMaterialTypeFilter();
    });

    it('displays material type filter', () => {
      expect(itemsRoute.materialTypeFilter.isPresent).to.equal(true);
    });

    describe('choose material type', () => {
      beforeEach(async function () {
        await itemsRoute.materialTypeFilter.options(0).clickOption();
      });

      it('finds instances by chosen material type', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });
  });
});
