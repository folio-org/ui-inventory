import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ItemViewPage from '../interactors/item-view-page';
import ItemEditPage from '../interactors/item-edit-page';
import ItemCreatePage from '../interactors/item-create-page';

describe('ItemViewPage', () => {
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
      expect(ItemViewPage.title).to.equal(`Item record ${item.barcode} ${item.status.name}`);
    });

    it('displays the edit button in the pane header', () => {
      expect(ItemViewPage.hasEditItemButton).to.be.true;
    });

    describe('clicking on edit button in the pane header', () => {
      beforeEach(async () => {
        await ItemViewPage.clickEditItemButton();
      });

      it('should redirect to item edit page', () => {
        expect(ItemEditPage.$root).to.exist;
      });
    });

    describe('pane header dropdown menu', () => {
      beforeEach(async () => {
        await ItemViewPage.headerDropdown.click();
      });

      it('should show a new request menu item', () => {
        expect(ItemViewPage.headerDropdownMenu.hasNewRequestItem).to.be.true;
      });

      it('should show a mark as missing item', () => {
        expect(ItemViewPage.headerDropdownMenu.hasMarkAsMissing).to.be.true;
      });

      it('should show a delete item menu item', () => {
        expect(ItemViewPage.headerDropdownMenu.hasDeleteItem).to.be.true;
      });

      it('should show a duplicate menu item', () => {
        expect(ItemViewPage.headerDropdownMenu.hasDuplicate).to.be.true;
      });

      describe('clicking on edit', () => {
        beforeEach(async () => {
          await ItemViewPage.headerDropdownMenu.clickEdit();
        });

        it('should redirect to item edit page', () => {
          expect(ItemEditPage.$root).to.exist;
        });
      });

      describe('clicking on duplicate', () => {
        beforeEach(async () => {
          await ItemViewPage.headerDropdownMenu.clickDuplicate();
        });

        it('should redirect to item create page', () => {
          expect(ItemCreatePage.$root).to.exist;
        });
      });

      describe('clicking on mark as missing', () => {
        beforeEach(async () => {
          await ItemViewPage.headerDropdownMenu.clickMarkAsMissing();
        });

        it('should open a missing confirmation modal', () => {
          expect(ItemViewPage.hasMarkAsMissingModal).to.exist;
        });
      });
    });
  });

  describe('visiting the paged item view page', () => {
    beforeEach(async function () {
      const instance = this.server.create(
        'instance',
        'withHoldingAndPagedItem',
        {
          title: 'ADVANCING RESEARCH',
        }
      );
      const holding = this.server.schema.instances.first().holdings.models[0];
      const item = holding.items.models[0].attrs;

      this.visit(`/inventory/view/${instance.id}/${holding.id}/${item.id}`);
      await ItemViewPage.whenLoaded();
    });

    describe('clicking on mark as missing', () => {
      beforeEach(async () => {
        await ItemViewPage.headerDropdownMenu.clickMarkAsMissing();
      });

      it('should open a missing confirmation modal', () => {
        expect(ItemViewPage.hasMarkAsMissingModal).to.exist;
      });
    });
  });

  describe('visiting the in process item view page', () => {
    beforeEach(async function () {
      const instance = this.server.create(
        'instance',
        'withHoldingAndInProcessItem',
        {
          title: 'ADVANCING RESEARCH',
        }
      );
      const holding = this.server.schema.instances.first().holdings.models[0];
      const item = holding.items.models[0].attrs;

      this.visit(`/inventory/view/${instance.id}/${holding.id}/${item.id}`);
      await ItemViewPage.whenLoaded();
    });

    describe('clicking on mark as missing', () => {
      beforeEach(async () => {
        await ItemViewPage.headerDropdownMenu.clickMarkAsMissing();
      });

      it('should open a missing confirmation modal', () => {
        expect(ItemViewPage.hasMarkAsMissingModal).to.exist;
      });
    });
  });
});
