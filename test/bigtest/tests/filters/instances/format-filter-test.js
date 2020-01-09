import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InventoryInteractor from '../../../interactors/inventory';

describe.only('Instances format filter', () => {
  setupApplication({ scenarios: ['resource-filters'] });

  const instances = new InventoryInteractor();

  beforeEach(function () {
    this.visit('/inventory');
  });

  describe('open format filter', () => {
    beforeEach(async () => {
      await instances.formatFilter.open();
    });

    it('displays format multi select', () => {
      expect(instances.formatFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
