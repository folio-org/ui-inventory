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
      },
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

  describe('filtering by createdDate', () => {
    beforeEach(async function () {
      await inventory.createdDate.open();
      await inventory.createdDate.filter.startDateInput.enterDate('2020-03-03');
      await inventory.createdDate.filter.endDateInput.enterDate('2020-03-13');
      await inventory.createdDate.filter.applyButton.click();
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

  describe('setting filters', () => {
    beforeEach(async function () {
      await inventory.clickSelectStaffSuppressFilter();
      await inventory.clickSelectDiscoverySuppressFilter();
    });

    it('adds filters to the URL', function () {
      expect(this.location.search).to.include('staffSuppress.true');
      expect(this.location.search).to.include('discoverySuppress.true');
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
  });
});
