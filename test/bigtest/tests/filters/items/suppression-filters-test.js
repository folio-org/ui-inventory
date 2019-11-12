import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemsRouteInteractor from '../../../interactors/routes/items-route';

describe.only('Item suppression filters', () => {
  setupApplication({ scenarios: ['item-filters'] });

  const itemRoute = new ItemsRouteInteractor();

  beforeEach(function () {
    this.visit('/inventory/items');
  });

  it('has a filter for discovery-suppressed items', () => {
    expect(itemRoute.isDiscoverySuppressFilterPresent).to.equal(true);
  });

  describe('setting filters', () => {
    beforeEach(async function () {
      await itemRoute.clickSelectDiscoverySuppressFilter();
    });

    it('adds filters to the URL', function () {
      expect(this.location.search).to.include('discoverySuppress.true');
    });

    describe('clearing filters', () => {
      beforeEach(async function () {
        await itemRoute.clickClearDiscoverySuppressFilter();
      });

      it('removes filters from the URL', function () {
        expect(this.location.search).to.not.include('discoverySuppress.true');
      });
    });
  });
});
