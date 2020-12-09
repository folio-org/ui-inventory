import {
  beforeEach,
  afterEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { INSTANCES_ID_REPORT_TIMEOUT } from '../../../src/constants';
import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';
import InstancesRouteInteractor from '../interactors/routes/instances-route';
import wait from '../helpers/wait';

describe('Instances', () => {
  setupApplication({ scenarios: ['instances-filters'] });

  const inventory = new InventoryInteractor({
    timeout: 5000,
    scope: '[data-test-inventory-instances]',
  });

  let xhr;
  let requests = [];

  async function setupInstancedIdReportInfoCallout(server, timeout) {
    server.get('/record-bulk/ids', () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([]), timeout);
      });
    });

    // Timeout to skip enabling animation
    await wait();

    const clock = sinon.useFakeTimers();

    await inventory.headerDropdownMenu.clickSaveInstancesUIIDsBtn();
    clock.tick(timeout);
    clock.restore();
  }

  describe('searching by instance HRID to fill items list', function () {
    beforeEach(async function () {
      this.visit('/inventory');
      const instancesRoute = new InstancesRouteInteractor();
      await instancesRoute.searchFieldFilter.searchField.selectIndex('Instance HRID');
      await instancesRoute.searchFieldFilter.searchField.fillInput('in00000000009');
      await instancesRoute.searchFieldFilter.clickSearch();
      await inventory.headerDropdown.click();
    });

    it('should enable action button for saving instances UIIDs if there are items in search result', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesUIIDsBtnDisabled).to.be.false;
    });

    it('should enable action button for saving instances CQL query if there are items in search result', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesCQLQueryDisabled).to.be.false;
    });

    describe('clicking saving instances CQL query button', () => {
      beforeEach(async function () {
        // Timeout to skip enabling animation
        await wait();
        await inventory.headerDropdownMenu.saveInstancesCQLQueryBtn.click();
      });

      it('should hide action items', () => {
        expect(inventory.headerDropdownMenu.saveInstancesCQLQueryBtn.isVisible).to.be.false;
      });
    });

    describe('clicking save instances UIIDs button with API request set up to fail', () => {
      beforeEach(async function () {
        this.server.put('/record-bulk/ids', {}, 500);

        // Timeout to skip enabling animation
        await wait();
        await inventory.headerDropdownMenu.clickSaveInstancesUIIDsBtn();
      });

      it('should display error callout', () => {
        expect(inventory.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe(`clicking save instances UIIDs button with API request which lasts more than ${INSTANCES_ID_REPORT_TIMEOUT} ms`, () => {
      beforeEach(async function () {
        await setupInstancedIdReportInfoCallout(this.server, INSTANCES_ID_REPORT_TIMEOUT + 1000);
      });

      it('should display info callout', () => {
        expect(inventory.callout.infoCalloutIsPresent).to.be.true;
      });
    });

    describe(`clicking save instances UIIDs button with API request which lasts less than ${INSTANCES_ID_REPORT_TIMEOUT} ms`, () => {
      beforeEach(async function () {
        await setupInstancedIdReportInfoCallout(this.server, INSTANCES_ID_REPORT_TIMEOUT - 1000);
      });

      it('should not display info callout', () => {
        expect(inventory.callout.infoCalloutIsPresent).to.be.false;
      });
    });
  });

  describe('clicking on header dropdown button', () => {
    beforeEach(async function () {
      this.visit('/inventory');

      await inventory.headerDropdown.click();
    });

    it('should display action button for saving items in transit to csv', () => {
      expect(inventory.headerDropdownMenu.itemsInTransitReportBtnIsVisible).to.be.true;
    });

    it('should display correct icon for saving items in transit to csv', () => {
      expect(inventory.headerDropdownMenu.isTransitItemsReportIconPresent).to.be.true;
    });

    it('should display action button for saving instances UIIDs to csv', () => {
      expect(inventory.headerDropdownMenu.saveInstancesUIIDsBtnIsVisible).to.be.true;
    });

    it('should display correct icon for saving instances UIIDs to csv', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesUIIDsIconPresent).to.be.true;
    });

    it('should disable action button for saving instances UIIDs if there are not items in search result', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesUIIDsBtnDisabled).to.be.true;
    });

    it('should display correct icon for saving instances CQL query to csv', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesCQLQueryIconPresent).to.be.true;
    });

    it('should disable action button for saving instances CQL query if there are no items in search result', () => {
      expect(inventory.headerDropdownMenu.isSaveInstancesCQLQueryDisabled).to.be.true;
    });

    it('should display action button for export instances (MARC)', () => {
      expect(inventory.headerDropdownMenu.exportInstancesMARCBtnIsVisible).to.be.true;
    });

    it('should display correct icon for export instances (MARC)', () => {
      expect(inventory.headerDropdownMenu.isExportInstancesMARCIconPresent).to.be.true;
    });

    it('should disable action button for export instances (MARC) if there are not items in search result', () => {
      expect(inventory.headerDropdownMenu.isExportInstancesMARCBtnDisabled).to.be.true;
    });

    it('should display action button for export instances (JSON)', () => {
      expect(inventory.headerDropdownMenu.exportInstancesJSONBtnIsVisible).to.be.true;
    });

    it('should display correct icon for export instances (JSON)', () => {
      expect(inventory.headerDropdownMenu.isExportInstancesJSONIconPresent).to.be.true;
    });

    it('should disable action button for export instances (JSON) if there are not items in search result', () => {
      expect(inventory.headerDropdownMenu.isExportInstancesJSONBtnDisabled).to.be.true;
    });

    describe('clicking Items in transit report button', () => {
      beforeEach(async function () {
        await inventory.headerDropdownMenu.clickItemsInTransitReportBtn();
      });

      it('should hide action items', () => {
        expect(inventory.headerDropdownMenu.itemsInTransitReportBtnIsVisible).to.be.false;
      });
    });

    describe('clicking save instances UIIDs button with empty instances list', () => {
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

      it('should not hide action items', () => {
        expect(inventory.headerDropdownMenu.saveInstancesUIIDsBtnIsVisible).to.be.true;
      });
    });
  });
});
