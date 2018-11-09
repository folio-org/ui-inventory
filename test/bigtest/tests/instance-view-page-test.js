import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceCreatePage from '../interactors/instance-create-page';

describe('InstanceViewPage', () => {
  setupApplication();

  beforeEach(async function () {
    const instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH',
    });
    this.visit(`/inventory/view/${instance.id}`);
  });

  it('displays the instance title in the pane header', () => {
    expect(InstanceViewPage.title).to.equal('ADVANCING RESEARCH');
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
    });
  });
});
