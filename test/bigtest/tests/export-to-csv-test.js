import {
  beforeEach,
  afterEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor({
    timeout: 5000,
    scope: '[data-test-inventory-instances]',
  });

  let xhr;
  let requests = [];

  describe('clicking on header dropdown button', () => {
    beforeEach(async function () {
      this.visit('/inventory');

      await inventory.headerDropdown.click();
    });

    it('should display action button for saving items in transit to csv', () => {
      expect(inventory.headerDropdownMenu.itemsInTransitReportBtnIsVisible).to.be.true;
    });

    it('should display action button for saving instances UIIDs to csv', () => {
      expect(inventory.headerDropdownMenu.saveInstancesUIIDsBtnIsVisible).to.be.true;
    });

    describe('clicking Items in transit report button', () => {
      beforeEach(async function () {
        await inventory.headerDropdownMenu.clickItemsInTransitReportBtn();
      });

      it('should hide action items', () => {
        expect(inventory.headerDropdownMenu.itemsInTransitReportBtnIsVisible).to.be.false;
      });
    });

    describe('clicking Save instances UIIDs button with empty instances list', () => {
      beforeEach(async function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function (req) { requests.push(req); };

        await inventory.headerDropdownMenu.clickSaveInstancesUIIDsBtn();
      });

      afterEach(async function () {
        await xhr.restore();
      });

      it('shouldn\'t send request to get fresh instances data', () => {
        expect(requests.length).to.equal(0);
      });

      it('should hide action items', () => {
        expect(inventory.headerDropdownMenu.saveInstancesUIIDsBtnIsVisible).to.be.false;
      });
    });
  });
});
