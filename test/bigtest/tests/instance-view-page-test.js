import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceCreatePage from '../interactors/instance-create-page';
import ItemViewPage from '../interactors/item-view-page';
import HoldingsViewPage from '../interactors/holdings-view-page';

describe('InstanceViewPage', () => {
  setupApplication();

  beforeEach(async function () {
    const instance = this.server.create('instance', 'withHoldingAndItem', {
      title: 'ADVANCING RESEARCH',
    });
    this.visit(`/inventory/view/${instance.id}`);
  });

  it('displays the instance title in the pane header', () => {
    expect(InstanceViewPage.title).to.equal('Instance record ADVANCING RESEARCH');
  });

  it('should render a View holdings button at the bottom of opened instance', () => {
    expect(InstanceViewPage.hasViewHoldingsButton).to.be.true;
  });

  describe('pane header dropdown menu', () => {
    beforeEach(async () => {
      await InstanceViewPage.headerDropdown.click();
    });

    describe('clicking on edit', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdownMenu.clickEdit();
      });

      it('should redirect to instance edit page', () => {
        expect(InstanceEditPage.$root).to.exist;
      });
    });

    describe('clicking on duplicate', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdownMenu.clickDuplicate();
      });

      it('should redirect to instance create page', () => {
        expect(InstanceCreatePage.$root).to.exist;
      });
      it('should have a source value of "FOLIO"', () => {
        expect(InstanceCreatePage.sourceValue).to.equal('FOLIO');
      });
    });
  });

  describe('items per holdings', () => {
    it('should render an app icon for each item in the items list', () => {
      expect(InstanceViewPage.items(0).hasAppIcon).to.be.true;
    });

    it('should render a link for each item in the items list', () => {
      expect(InstanceViewPage.items(0).hasBarcodeLink).to.be.true;
    });

    describe('clicking item link', () => {
      beforeEach(async () => {
        await InstanceViewPage.items(0).clickBarcode();
      });

      it('should redirect to item view page', () => {
        expect(ItemViewPage.$root).to.exist;
      });
    });

    describe('clicking view holdings button', () => {
      beforeEach(async () => {
        await InstanceViewPage.clickViewHoldings();
      });

      it('should redirect to holding view page', () => {
        expect(HoldingsViewPage.$root).to.exist;
      });
    });
  });
});
