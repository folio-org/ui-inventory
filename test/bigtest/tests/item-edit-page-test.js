import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ItemEditPage from '../interactors/item-edit-page';
import ItemPage from '../interactors/item-page';

describe('ItemEditPage', () => {
  setupApplication();

  let instance;

  const itemPage = new ItemPage();

  const holdings = {
    id: '0e3a404a-61a9-4388-9d11-c7d62d491165',
    callNumber: 911,
  };

  const item = {
    id: '7fd93634-a3f5-4a7a-9db2-1c6dc4bd6b65',
    status : {
      name: 'Available',
    },
    title: 'ADVANCING RESEARCH',
    holdingsRecordId: holdings.id,
    barcode: 337,
    copyNumber: '',
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

    this.visit(`/inventory/view/${instance.id}/${holdings.id}/${item.id}?layer=editItem`);
    await ItemEditPage.whenLoaded();
  });

  it('displays a title in the pane header', () => {
    expect(ItemEditPage.title).to.equal(`${instance.title}`);
  });

  it('displays a sub in the pane header', () => {
    expect(ItemEditPage.sub).to.equal(`Holdings: > ${holdings.callNumber}`);
  });

  describe('pane header menu', () => {
    beforeEach(async () => {
      await ItemEditPage.headerDropdown.click();
    });

    describe('clicking on cancel', () => {
      beforeEach(async () => {
        await ItemEditPage.headerDropdownMenu.clickCancel();
        await itemPage.whenLoaded();
      });

      it('should redirect to instance view page after click', () => {
        expect(itemPage.isLoaded).to.equal(true);
      });
    });
  });
});
