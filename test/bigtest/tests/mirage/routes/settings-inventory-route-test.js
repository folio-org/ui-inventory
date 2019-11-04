import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';

import InventorySettingsRouteInteractor from '../../../interactors/routes/inventory-settings-route';

describe('InventorySettingsRoute', () => {
  describe('User has not permissions to view settings/inventory instances, items, holdings', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': false
      }
    });
    const inventorySettingsRoute = new InventorySettingsRouteInteractor();

    beforeEach(async function () {
      await this.visit('settings/inventory');
    });

    it('opens settings inventory route', () => {
      expect(inventorySettingsRoute.isPresent).to.equal(false);
    });

    it('settings inventory route has inventory instances, items, holdings', () => {
      expect(inventorySettingsRoute.hasSectionItem).to.be.false;
    });
  });
});
