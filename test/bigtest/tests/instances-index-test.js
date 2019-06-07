import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor();

  beforeEach(async function () {
    this.visit('/inventory');
  });

  it('is no results message label present', () => {
    expect(inventory.isNoResultsMessageLabelPresent).to.equal(true);
  });

  describe('search by barcode', function () {
    beforeEach(async function () {
      this.server.createList('instance', 25, 'withHoldingAndItem');
      const item = this.server.schema.instances.first().holdings.models[0].items.models[0];
      await inventory.chooseSearchOption('Barcode');
      await inventory.fillSearchField(item.barcode);
      await inventory.clickSearch();
    });

    it('should find instance with given barcode', () => {
      expect(inventory.instances().length).to.be.equal(1);
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

  describe('search by ISSN', function () {
    beforeEach(async function () {
      this.server.createList('instance', 25, 'withHoldingAndItem');
      await inventory.chooseSearchOption('- ISSN');
      await inventory.fillSearchField('incorrect value');
      await inventory.clickSearch();
    });

    it('should not find instance with given ISSN', () => {
      expect(inventory.instances().length).to.be.equal(0);
    });

    it('is no results message label present', () => {
      expect(inventory.isNoResultsMessageLabelPresent).to.equal(true);
    });
  });
});
