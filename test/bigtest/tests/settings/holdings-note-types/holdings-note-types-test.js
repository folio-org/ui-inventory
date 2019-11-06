import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsNoteTypes from '../../../interactors/settings/holdings-note-types/holdings-note-types';

describe('Holdings note types', () => {
  function mockData() {
    this.server.create('holdingsNoteType', {
      'id' : 'd6510242-5ec3-42ed-b593-3585d2e48fd6',
      'name' : 'Action note',
      'source' : 'folio'
    });
    this.server.create('holdingsNoteType', {
      'id' : 'e19eabab-a85c-4aef-a7b2-33bd9acef24e',
      'name' : 'Binding',
      'source' : 'folio'
    });
    this.server.create('holdingsNoteType', {
      'id' : 'c4407cc7-d79f-4609-95bd-1cefb2e2b5c5',
      'name' : 'Copy note',
      'source' : 'folio'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.holdings-note-types': true
      }
    });

    beforeEach(mockData);

    describe('viewing holdings note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/holdingsNoteTypes');
      });

      it('has a holdings note types list', () => {
        expect(HoldingsNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(HoldingsNoteTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, delete buttons', () => {
        expect(HoldingsNoteTypes.hasCreateButton).to.be.true;
        expect(HoldingsNoteTypes.hasEditButton).to.be.true;
        expect(HoldingsNoteTypes.hasDeleteButton).to.be.true;
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

    describe('viewing alternative title types list', () => {
      beforeEach(async function () {
        await this.visit('/settings/inventory/holdingsNoteTypes');
      });

      it('has an altenative title types list', () => {
        expect(HoldingsNoteTypes.hasList).to.be.false;
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

    describe('viewing holdings note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/holdingsNoteTypes');
      });

      it('has a holdings note types list', () => {
        expect(HoldingsNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(HoldingsNoteTypes.rowCount).to.equal(3);
      });

      it('list does not have new, edit, delete buttons', () => {
        expect(HoldingsNoteTypes.hasCreateButton).to.be.false;
        expect(HoldingsNoteTypes.hasEditButton).to.be.false;
        expect(HoldingsNoteTypes.hasDeleteButton).to.be.false;
      });
    });
  });
});
