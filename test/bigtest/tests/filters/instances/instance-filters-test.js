import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InventoryInteractor from '../../../interactors/inventory';

describe('Instance filters', () => {
  setupApplication();

  const inventory = new InventoryInteractor({
    timeout: 3000,
    scope: '[data-test-inventory-instances]',
  });

  beforeEach(async function () {
    this.server.createList('instance', 25, 'withHoldingAndItem');
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
