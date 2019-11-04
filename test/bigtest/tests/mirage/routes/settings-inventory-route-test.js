import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InvSettingsRouteInteractor from '../../../interactors/routes/inventory-settings-route';


describe('Settings inventory route', () => {
  describe('User has not permissions to view settings/inventory instances, items, holdings', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true
      }
    });

    const invSettingsRoute = new InvSettingsRouteInteractor();

    beforeEach(async function () {
      this.visit('/settings/inventory');
    });

    it('settings inventory route has inventory instances, items, holdings list', () => {
      expect(invSettingsRoute.hasSectionItem).to.be.false;
    });

    it('settings inventory route has inventory instance', () => {
      expect(invSettingsRoute.hasInstance).to.be.false;
    });

    it('settings inventory route has inventory instance', () => {
      expect(invSettingsRoute.hasAlternativeTitleInstance).to.be.false;
    });
  });

  describe('User has permissions to view settings/inventory instances, items, holdings', () => {
    setupApplication();

    const invSettingsRoute = new InvSettingsRouteInteractor();

    beforeEach(async function () {
      this.visit('/settings/inventory');
    });

    it('settings inventory route has inventory instances, items, holdings list', () => {
      expect(invSettingsRoute.hasSectionItem).to.be.false;
    });

    it('settings inventory route has inventory instance', () => {
      expect(invSettingsRoute.hasInstance).to.be.false;
    });

    it('settings inventory route has inventory instance', () => {
      expect(invSettingsRoute.hasAlternativeTitleInstance).to.be.false;
    });
  });
});
