import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceCreatePage from '../interactors/instance-create-page';
import InventoryInteractor from '../interactors/inventory';

describe('InstanceCreatePage', () => {
  setupApplication();
  const inventory = new InventoryInteractor();

  beforeEach(async function () {
    this.visit('/inventory/view?layer=create');
  });

  describe('visiting the instance create page', () => {
    it('displays the instance title in the pane header', () => {
      expect(InstanceCreatePage.title).to.equal('New instance');
    });

    describe('pane header dropdown menu', () => {
      beforeEach(async () => {
        await InstanceCreatePage.headerDropdown.click();
      });

      describe('clicking on cancel', () => {
        beforeEach(async () => {
          await InstanceCreatePage.headerDropdownMenu.clickCancel();
        });

        it('should redirect to the list of instances', () => {
          expect(inventory.$root).to.exist;
        });
      });
    });
  });
});
