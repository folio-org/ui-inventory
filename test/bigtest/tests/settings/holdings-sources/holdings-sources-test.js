import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsSources from '../../../interactors/settings/holdings-sources/holdings-sources';

describe('Holdings Sources', () => {
  function mockData() {
    this.server.create('holdingsSource', {
      'id' : 'd6510242-5ec3-42ed-b593-3585d2e48fd6',
      'name' : 'FOLIO',
      'source' : 'folio'
    });
    this.server.create('holdingsSource', {
      'id' : 'e19eabab-a85c-4aef-a7b2-33bd9acef24e',
      'name' : 'MARC',
      'source' : 'folio'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.holdings-sources': true
      }
    });

    beforeEach(mockData);

    describe('viewing holdings sources list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/holdingsSources');
      });

      it('has a holdings sources list', () => {
        expect(HoldingsSources.hasList).to.be.true;
      });

      it('list has 2 items', () => {
        expect(HoldingsSources.rowCount).to.equal(2);
      });

      it('list has new, edit, delete buttons', () => {
        expect(HoldingsSources.hasCreateButton).to.be.true;
        expect(HoldingsSources.hasEditButton).to.be.true;
        expect(HoldingsSources.hasDeleteButton).to.be.true;
      });
    });
  });

  describe('User does not have permissions to see the list', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true
      }
    });

    beforeEach(mockData);

    describe('viewing holdings sources list', () => {
      beforeEach(async function () {
        await this.visit('/settings/inventory/holdingsSources');
      });

      it('does not show the holding sources list', () => {
        expect(HoldingsSources.hasList).to.be.false;
      });
    });
  });

  describe('User does not have permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true
      }
    });
    beforeEach(mockData);

    describe('viewing holdings holdings sources list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/holdingsSources');
      });

      it('has a holdings sources list', () => {
        expect(HoldingsSources.hasList).to.be.true;
      });

      it('list has 2 items', () => {
        expect(HoldingsSources.rowCount).to.equal(2);
      });

      it('list does not have new, edit, delete buttons', () => {
        expect(HoldingsSources.hasCreateButton).to.be.false;
        expect(HoldingsSources.hasEditButton).to.be.false;
        expect(HoldingsSources.hasDeleteButton).to.be.false;
      });
    });
  });
});
