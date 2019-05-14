import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor();

  beforeEach(async function () {
    this.server.createList('instance', 25, 'withHoldingAndItem');
    this.visit('/inventory');
  });

  it('shows the list of inventory items', () => {
    expect(inventory.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(inventory.instances().length).to.be.gte(5);
  });

  it('has a search filter with an "all" option', function () {
    expect(inventory.filter.all).to.equal('All (title, contributor, identifier)');
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await inventory.instances(0).click();
    });

    it('loads the instance details', function () {
      expect(inventory.instance.isVisible).to.equal(true);
    });
  });

  describe('search by barcode', function () {
    beforeEach(async function () {
      const item = this.server.schema.instances.first().holdings.models[0].items.models[0];
      await inventory.chooseFilter('Barcode');
      await inventory.fillFilter(item.barcode);
      await inventory.clickSearch();
    });

    it('should find instance with given barcode', () => {
      expect(inventory.instances().length).to.be.equal(1);
    });
  });
});
