import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ItemViewPage from '../interactors/item-view-page';

describe('Delete item available', () => {
  setupApplication();

  describe('visiting the item view page', () => {
    let item;

    beforeEach(async function () {
      const instance = this.server.create(
        'instance',
        'withHoldingAndItem',
        {
          title: 'ADVANCING RESEARCH',
        }
      );
      const holding = this.server.schema.instances.first().holdings.models[0];
      item = holding.items.models[0].attrs;

      this.visit(`/inventory/view/${instance.id}/${holding.id}/${item.id}`);
      await ItemViewPage.whenLoaded();
    });

    it('displays the title in the pane header', () => {
      expect(ItemViewPage.title).to.equal(`Item • ${item.barcode} • ${item.status.name}`);
    });

    describe('pane header dropdown menu, click delete', () => {
      beforeEach(async () => {
        await ItemViewPage.headerDropdown.click();
        await ItemViewPage.headerDropdownMenu.clickDelete();
      });

      it('should open delete confirmation modal and not cannot-delete modal', () => {
        expect(ItemViewPage.cannotDeleteItemModal.isPresent).to.be.false;
        expect(ItemViewPage.confirmDeleteItemModal.isPresent).to.be.true;
      });

      describe('confirm-delete-item modal disappears', () => {
        beforeEach(async () => {
          await ItemViewPage.headerDropdown.click();
          await ItemViewPage.headerDropdownMenu.clickDelete();
          await ItemViewPage.confirmDeleteItemModal.cancelButton.click();
        });

        it('when cancel button is clicked', () => {
          expect(ItemViewPage.confirmDeleteItemModal.isPresent).to.be.false;
        });
      });
    });
  });
});
