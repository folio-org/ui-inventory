import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceViewPage from '../interactors/instance-view-page';

describe.only('InstanceEditPage', () => {
  setupApplication();

  beforeEach(async function () {
    const instance = this.server.create('instance');

    this.visit(`/inventory/view/${instance.id}?layer=edit`);
  });

  it('displays the instance title in the pane header', () => {
    expect(InstanceEditPage.title).to.equal('Edit');
  });

  describe('pane header dropdown menu', () => {
    beforeEach(async () => {
      await InstanceEditPage.headerDropdown.click();
    });

    it('should not show the select-format select menu', () => {
      expect(InstanceEditPage.selectFormat.exists).to.be.false;
    });

    it('should not show the select-language select menu', () => {
      expect(InstanceEditPage.selectLanguage.exists).to.be.false;
    });

    describe('clicking on add-format', () => {
      beforeEach(async () => {
        await InstanceEditPage.clickAddFormatButton.click();
      });

      it('should show the select-format select menu', () => {
        expect(InstanceEditPage.selectFormat).to.exist;
      });

      it('should show the select-format select menu', () => {
        expect(InstanceEditPage.selectFormat.firstOptionText).to.equal('Select format');
      });
    });

    describe('clicking on add-language', () => {
      beforeEach(async () => {
        await InstanceEditPage.clickAddLanguageButton.click();
      });

      it('should show the select-language select menu', () => {
        expect(InstanceEditPage.selectLanguage).to.exist;
      });

      it('should show the select-language select menu', () => {
        expect(InstanceEditPage.selectLanguage.firstOptionText).to.equal('Select language');
      });
    });

    describe('clicking on cancel', () => {
      beforeEach(async () => {
        await InstanceEditPage.headerDropdownMenu.clickCancel();
      });

      it('should redirect to instance view page', () => {
        expect(InstanceViewPage.$root).to.exist;
      });
    });
  });
});
