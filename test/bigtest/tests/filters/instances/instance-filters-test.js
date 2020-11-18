import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';

import InventoryInteractor from '../../../interactors/inventory';

describe('Instance filters', () => {
  setupApplication();

  const instancesRoute = new InstancesRouteInteractor();

  const inventory = new InventoryInteractor({
    timeout: 3000,
    scope: '[data-test-inventory-instances]',
  });

  beforeEach(async function () {
    this.server.createList('instance', 25, 'withHoldingAndItem');

    this.server.create('instance', {
      title: 'Homo Deus: A Brief History of Tomorrow',
      contributors: [{ name: 'Yuval Noah Harari' }],
      metadata: {
        createdDate: '2020-03-04',
        updatedDate: '2020-04-15',
      },
      source: 'MARC',
    }, 'withHoldingAndItem');

    this.server.create('instance-type', {
      name: 'text',
      code: 'txt',
      source: 'FOLIO'
    });

    this.visit('/inventory');
  });


  it('has a filter for effective location', () => {
    expect(inventory.isEffectiveLocationFilterPresent).to.equal(true);
  });

  it('has a filter for resource type', () => {
    expect(inventory.isResourceFilterPresent).to.equal(true);
  });

  it('has a filter for staff-suppressed items', () => {
    expect(inventory.isStaffSuppressFilterPresent).to.equal(true);
  });

  it('has a filter for discovery-suppressed items', () => {
    expect(inventory.isDiscoverySuppressFilterPresent).to.equal(true);
  });

  it('has a filter for created date', () => {
    expect(inventory.createdDate.isPresent).to.equal(true);
  });

  it('has a filter for updated date', () => {
    expect(inventory.updatedDate.isPresent).to.equal(true);
  });

  it('has a filter for source', () => {
    expect(inventory.source.isPresent).to.equal(true);
  });

  describe('filtering by createdDate', () => {
    beforeEach(async function () {
      await inventory.createdDate.open();
      await inventory.createdDate.fillStartDateInput('2020-03-03');
      await inventory.createdDate.fillEndDateInput('2020-03-13');
      await inventory.createdDate.clickApplyButton();
    });

    it('should find instance by created date', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });

    describe('clicking clear button', () => {
      beforeEach(async function () {
        await inventory.createdDate.clear();
      });

      it('should not find any instance by created date', () => {
        expect(instancesRoute.rows().length).to.equal(0);
      });
    });
  });

  describe('filtering by updatedDate', () => {
    beforeEach(async function () {
      await inventory.updatedDate.open();
      await inventory.updatedDate.fillStartDateInput('2020-04-13');
      await inventory.updatedDate.fillEndDateInput('2020-04-16');
      await inventory.updatedDate.clickApplyButton();
    });

    it('should find instance by updated date', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });

    describe('clicking clear button', () => {
      beforeEach(async function () {
        await inventory.updatedDate.clear();
      });

      it('should not find any instance by updated date', () => {
        expect(instancesRoute.rows().length).to.equal(0);
      });
    });
  });

  describe('filtering by source', () => {
    beforeEach(async function () {
      await inventory.source.open();
      await inventory.source.checkboxes.dataOptions(5).click();
    });

    it('should find instance by source', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });

    describe('clicking clear button', () => {
      beforeEach(async function () {
        await inventory.source.clear();
      });

      it('should not find any instance by source', () => {
        expect(instancesRoute.rows().length).to.equal(0);
      });
    });
  });

  describe('setting filters and sorting', () => {
    beforeEach(async function () {
      await inventory.clickSelectStaffSuppressFilter();
      await inventory.clickSelectDiscoverySuppressFilter();
      await instancesRoute.headers(2).click();
    });

    it('adds filters to the URL', function () {
      expect(this.location.search).to.include('staffSuppress.true');
      expect(this.location.search).to.include('discoverySuppress.true');
    });

    it('selected sorting should be set in URL', function () {
      expect(this.location.search).to.include('sort=contributors');
    });

    describe('clearing filters', () => {
      beforeEach(async function () {
        await inventory.clickClearStaffSuppressFilter();
        await inventory.clickClearDiscoverySuppressFilter();
      });

      it('removes filters from the URL', function () {
        expect(this.location.search).to.not.include('staffSuppress.true');
        expect(this.location.search).to.not.include('discoverySuppress.true');
      });
    });

    describe('clicking Reset all button', () => {
      beforeEach(async function () {
        await inventory.resetAll();
      });

      it('default sorting should be set in URL', function () {
        expect(this.location.search).to.include('sort=title');
      });
    });
  });
});
