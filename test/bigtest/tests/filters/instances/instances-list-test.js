import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';
import InventoryInteractor from '../../../interactors/inventory';

describe('Instances list', () => {
  setupApplication();

  const instancesRoute = new InstancesRouteInteractor();
  const inventory = new InventoryInteractor({
    timeout: 3000,
    scope: '[data-test-inventory-instances]',
  });

  beforeEach(function () {
    this.server.create('instance', {
      title: 'Homo Deus: A Brief History of Tomorrow',
      contributors: [{ name: 'Yuval Noah Harari' }],
      metadata: {
        createdDate: '2020-03-04',
        updatedDate: '2020-04-15',
      },
      source: 'MARC',
    }, 'withHoldingAndItem');

    this.visit('/inventory');
  });

  describe('filtering by source', () => {
    beforeEach(async () => {
      await inventory.source.open();
      await inventory.source.checkboxes.dataOptions(5).click();
    });

    it('should have proper list results size', () => {
      expect(instancesRoute.rows().length).to.equal(1);
    });

    it('should render nothing for select row column header', () => {
      expect(instancesRoute.headers(0).text).to.equal('');
    });

    it('should display unchecked select row checkbox', () => {
      expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.false;
    });
  });
});
