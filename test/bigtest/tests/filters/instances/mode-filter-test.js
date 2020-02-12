import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InventoryInteractor from '../../../interactors/inventory';

describe('Modes of issuance filter', () => {
  setupApplication({ scenarios: ['resource-filters'] });

  const instances = new InventoryInteractor();

  beforeEach(function () {
    this.visit('/inventory');
  });

  describe('opening mode of issuance filter', () => {
    beforeEach(async () => {
      await instances.modeFilter.open();
    });

    it('should display mode multi select', () => {
      expect(instances.modeFilter.multiSelect.isPresent).to.equal(true);
    });
  });
});
