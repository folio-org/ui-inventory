import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsSources from '../../../interactors/settings/holdings-sources/holdings-sources';

describe('Holdings Sources', () => {
  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.holdings-sources': true
      }
    });

    describe('viewing holdings sources list', () => {
      beforeEach(async function () {
        this.server.createList('holdingsSource', 2);

        await this.visit('/settings/inventory/holdingsSources');
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

    describe('viewing holdings sources list with source value "folio"', () => {
      beforeEach(async function () {
        this.server.createList('holdingsSource', 2, { source: 'folio' });

        await this.visit('/settings/inventory/holdingsSources');
      });

      it('has a holdings sources list', () => {
        expect(HoldingsSources.hasList).to.be.true;
      });

      it('list has 2 items', () => {
        expect(HoldingsSources.rowCount).to.equal(2);
      });

      it('list has new buttons', () => {
        expect(HoldingsSources.hasCreateButton).to.be.true;
      });

      it('list does not have edit, delete buttons', () => {
        expect(HoldingsSources.hasEditButton).to.be.false;
        expect(HoldingsSources.hasDeleteButton).to.be.false;
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

    describe('viewing holdings sources list', () => {
      beforeEach(async function () {
        this.server.createList('holdingsSource', 2);

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

    describe('viewing holdings holdings sources list', () => {
      beforeEach(async function () {
        this.server.createList('holdingsSource', 2);

        await this.visit('/settings/inventory/holdingsSources');
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
