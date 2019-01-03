import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ItemViewPage from '../interactors/item-view-page';
import ItemEditPage from '../interactors/item-edit-page';
import ItemCreatePage from '../interactors/item-create-page';

describe('ItemViewPage', () => {
  setupApplication();

  describe('visiting the item view page', () => {
    let instance;

    const holdings = {
      id: '0e3a404a-61a9-4388-9d11-c7d62d491165',
    };

    const item = {
      id: '7fd93634-a3f5-4a7a-9db2-1c6dc4bd6b65',
      status : {
        name: 'Available',
      },
      title: '14 cows for America',
      holdingsRecordId: '5f6d50f1-e3bf-4c04-8621-4e3dc3d9b543',
      barcode: 337,
      copyNumbers: [],
      notes: [],
      materialType: {
        id: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        name: 'book'
      },
      permanentLoanType: {
        id: '2b94c631-fca9-4892-a730-03ee529ffe27',
        name: 'Can circulate'
      },
      metadata: {
        createdDate: '2018-11-08T09:13:10.786+0000',
        createdByUserId: 'a57c472e-82fe-552f-864d-5f41ac1c8e43',
        updatedDate: '2018-11-08T09:13:10.786+0000',
        updatedByUserId: 'a57c472e-82fe-552f-864d-5f41ac1c8e43'
      },
      links: {},
      effectiveLocation: {
        id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
        name: 'Main Library'
      }
    };

    beforeEach(async function () {
      instance = this.server.create('instance', {
        title: 'ADVANCING RESEARCH',
      });

      this.server.get('/holdings-storage/holdings/:id', holdings);
      this.server.get('/inventory/items/:id', item);

      this.visit(`/inventory/view/${instance.id}/${holdings.id}/${item.id}`);
      await ItemViewPage.whenLoaded();
    });

    it('displays the title in the pane header', () => {
      expect(ItemViewPage.title).to.equal(`${item.barcode}Item . ${item.status.name}`);
    });

    describe('pane header dropdown menu', () => {
      beforeEach(async () => {
        await ItemViewPage.headerDropdown.click();
      });

      it('should show a new request menu item', () => {
        expect(ItemViewPage.headerDropdownMenu.hasNewRequestItem).to.be.true;
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
    });
  });
});
