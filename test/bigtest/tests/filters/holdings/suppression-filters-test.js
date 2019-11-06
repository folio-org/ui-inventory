import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/items-route';

describe('Holdings suppression filters', () => {
  setupApplication();

  // const inventory = new InventoryInteractor({
  //   timeout: 3000,
  //   scope: '[data-test-inventory-instances]',
  // });
  const holdings = new HoldingsRouteInteractor();

  beforeEach(async function () {
    this.server.createList('instance', 25, 'withHoldingAndItem');
    this.server.create('instance-type', {
      name: 'text',
      code: 'txt',
      source: 'FOLIO'
    });

    this.visit('/inventory/holdings');
  });

  it('has a filter for staff-suppressed items', () => {
    expect(holdings.isStaffSuppressFilterPresent).to.equal(true);
  });

  it('has a filter for discovery-suppressed items', () => {
    expect(holdings.isDiscoverySuppressFilterPresent).to.equal(true);
  });

  // describe('setting filters', () => {
  //   beforeEach(async function () {
  //     await inventory.clickSelectStaffSuppressFilter();
  //     await inventory.clickSelectDiscoverySuppressFilter();
  //   });

  //   it('adds filters to the URL', function () {
  //     expect(this.location.search).to.include('staffSuppress.true');
  //     expect(this.location.search).to.include('discoverySuppress.true');
  //   });

  //   describe('clearing filters', () => {
  //     beforeEach(async function () {
  //       await inventory.clickClearStaffSuppressFilter();
  //       await inventory.clickClearDiscoverySuppressFilter();
  //     });

  //     it('removes filters from the URL', function () {
  //       expect(this.location.search).to.not.include('staffSuppress.true');
  //       expect(this.location.search).to.not.include('discoverySuppress.true');
  //     });
  //   });
  // });
});
