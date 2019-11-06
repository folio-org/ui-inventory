import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe.only('ItemMaterialTypeFilter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(async function () {
    this.visit('/inventory/items');
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

    describe('fill material type', () => {
      beforeEach(async function () {
        const materialType = this.server.schema.materialTypes.first();
        const name = materialType.attrs.name.split(' ')[0];

        await itemsRoute.materialTypeFilter.fillFilter(name);
        await itemsRoute.materialTypeFilter.options(0).clickOption();
      });

      it('finds instances by chosen material type', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });
  });
});
