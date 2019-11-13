import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe('Item pane permanent location filter', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemsRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/items');
  });

  describe('open permanent location filter', () => {
    beforeEach(async () => {
      await itemsRoute.permLocationFilter.open();
    });

    it('displays the permanent location multi select', () => {
      expect(itemsRoute.permLocationFilter.multiSelect.isPresent).to.equal(true);
    });

    // describe('choose location', () => {
    //   beforeEach(async () => {
    //     await itemsRoute.permLocationFilter.multiSelect.options(0).clickOption();
    //   });

    //   it('finds instances by chosen holdings perm location', () => {
    //     expect(itemsRoute.rows().length).to.equal(1);
    //   });
    // });

    // describe('fill location', () => {
    //   beforeEach(async () => {
    //     await itemsRoute.permLocationFilter.multiSelect.fillFilter('A');
    //     await itemsRoute.permLocationFilter.multiSelect.options(0).clickOption();
    //   });

    //   it('finds instances by filled holdings perm location', () => {
    //     expect(itemsRoute.rows().length).to.equal(1);
    //   });

    //   describe('clear holdings perm location filter', () => {
    //     beforeEach(async () => {
    //       await itemsRoute.permLocationFilter.clear();
    //     });

    //     it('clears instances', () => {
    //       expect(itemsRoute.rows().length).to.equal(0);
    //     });
    //   });
    // });
  });
});
