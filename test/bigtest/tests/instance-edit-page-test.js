import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceViewPage from '../interactors/instance-view-page';

describe('InstanceEditPage', () => {
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
