import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import HoldingsCreatePage from '../interactors/holdings-create-page';
import InstanceViewPage from '../interactors/instance-view-page';

describe('HoldingsCreatePage', () => {
  setupApplication();

  let instance;

  beforeEach(async function () {
    instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH',
    });

    this.visit(`/inventory/create/${instance.id}/holding`);
    await HoldingsCreatePage.whenLoaded();
  });

  describe('visiting the holdings create page', () => {
    it('displays the holdings name in the pane header', () => {
      expect(HoldingsCreatePage.title).to.equal(instance.title);
    });
  });

  describe('clicking on cancel', () => {
    beforeEach(async () => {
      await HoldingsCreatePage.clickCancel();
      await InstanceViewPage.whenLoaded();
    });

    it('should redirect to instance view page after click', () => {
      expect(InstanceViewPage.$root).to.exist;
    });
  });
});
