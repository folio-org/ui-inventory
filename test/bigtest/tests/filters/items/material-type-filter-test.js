import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('ItemMaterialTypeFilter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/items');
  });

  describe('open material type filter', () => {
    beforeEach(async () => {
      await itemsRoute.materialTypeFilter.open();
    });

    it('displays material type multi select', () => {
      expect(itemsRoute.materialTypeFilter.multiSelect.isPresent).to.equal(true);
    });

    describe('choose material type', () => {
      beforeEach(async () => {
        await itemsRoute.materialTypeFilter.multiSelect.options(0).clickOption();
      });

      it('finds instances by chosen material type', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });
    });

    describe('fill material type', () => {
      beforeEach(async () => {
        await itemsRoute.materialTypeFilter.multiSelect.fillFilter('o');
        await itemsRoute.materialTypeFilter.multiSelect.options(0).clickOption();
      });

      it('finds instances by filled material type', () => {
        expect(itemsRoute.rows().length).to.equal(1);
      });

      describe('clear material type filter', () => {
        beforeEach(async () => {
          await itemsRoute.materialTypeFilter.clear();
        });

        it('clears instances', () => {
          expect(itemsRoute.rows().length).to.equal(0);
        });
      });
    });
  });
});
