import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor();

  beforeEach(async function () {
    this.server.createList('instance', 25);
    this.visit('/inventory');
  });

  it('shows the list of inventory items', () => {
    expect(inventory.isVisible).to.equal(true);
  });

  it('renders each instance', () => {
    expect(inventory.instances().length).to.be.gte(5);
  });

  describe('clicking on the first item', function () {
    beforeEach(async function () {
      await inventory.instances(0).click();
    });

    it('loads the instance details', function () {
      expect(inventory.instance.isVisible).to.equal(true);
    });
  });
});
