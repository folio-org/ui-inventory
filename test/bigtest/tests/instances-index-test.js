import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';
import ItemPageInteractor from '../interactors/item-page';
import InstanceCreatePage from '../interactors/instance-create-page';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor({
    timeout: 3000,
    scope: '[data-test-inventory-instances]',
  });

  const itemInteractor = new ItemPageInteractor();

  describe('instance segment', () => {
    beforeEach(async function () {
      this.server.createList('instance', 25, 'withHoldingAndItem');
      this.server.create('instance-type', {
        name: 'text',
        code: 'txt',
        source: 'FOLIO'
      });

      this.visit('/inventory?segment=items');
    });

    it('is no results message label present', () => {
      expect(inventory.isNoResultsMessageLabelPresent).to.equal(true);
    });

    describe('New action', () => {
      beforeEach(async () => {
        await inventory.headerDropdown.click();
        await inventory.headerDropdownMenu.clickNewInstanceBtn();
      });

      it('should open instance form', () => {
        expect(InstanceCreatePage.isPresent).to.be.true;
      });
    });

    describe('search by barcode', function () {
      beforeEach(async function () {
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

    describe('remember search results', function () {
      beforeEach(async function () {
        const item = this.server.schema.instances.first().holdings.models[0].items.models[0];

        await inventory.chooseSearchOption('Barcode');
        await inventory.fillSearchField(item.barcode);
        await inventory.clickSearch();
        await inventory.openInstance();
        await inventory.openItem();
        await itemInteractor.closeItem();
      });

      it('should keep search results around after item is closed', () => {
        expect(inventory.instances().length).to.be.equal(1);
      });
    });

    describe('search by ISSN', function () {
      beforeEach(async function () {
        await inventory.chooseSearchOption('ISSN');
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
});
