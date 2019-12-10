import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InventoryInteractor from '../../../interactors/inventory';

describe('Instances resource type filter', () => {
  setupApplication({ scenarios: ['resource-filters'] });

  const instances = new InventoryInteractor();

  beforeEach(function () {
    this.visit('/inventory');
  });

  describe('open resource type filter', () => {
    beforeEach(async () => {
      await instances.resourceTypeFilter.open();
    });

    it('displays resource type multi select', () => {
      expect(instances.resourceTypeFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
