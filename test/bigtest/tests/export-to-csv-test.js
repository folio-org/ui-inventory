import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InventoryInteractor from '../interactors/inventory';

describe('Instances', () => {
  setupApplication();

  const inventory = new InventoryInteractor();

  beforeEach(async function () {
    this.visit('/inventory');
    await inventory.headerDropdown.click();
    await inventory.headerDropdownMenu.clickItemsInTransitReportBtn();
  });

  it('should export items in transit to csv', () => {
    expect(inventory.headerDropdownMenu.itemsInTransitReportBtnIsVisible).to.be.false;
  });
});
