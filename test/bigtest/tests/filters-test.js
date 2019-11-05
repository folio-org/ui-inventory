import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe.only('Instance filters', () => {
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

  it('has a filter for location', () => {
    expect(inventory.isLocationFilterPresent).to.equal(true);
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
});
