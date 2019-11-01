import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ItemNoteTypes from '../../../interactors/settings/item-note-types/item-note-types';

describe('Item note types', () => {
  function mockData() {
    this.server.create('itemNoteType', {
      'id' : '0e40884c-3523-4c6d-8187-d578e3d2794e',
      'name' : 'Action note',
      'source' : 'folio'
    });
    this.server.create('itemNoteType', {
      'id' : '87c450be-2033-41fb-80ba-dd2409883681',
      'name' : 'Binding',
      'source' : 'folio'
    });
    this.server.create('itemNoteType', {
      'id' : '1dde7141-ec8a-4dae-9825-49ce14c728e7',
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
        'ui-inventory.settings.item-note-types': true
      }
    });

    beforeEach(mockData);

    describe('viewing item note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/itemNoteTypes');
      });

      it('has a item note types list', () => {
        expect(ItemNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(ItemNoteTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, delete buttons', () => {
        expect(ItemNoteTypes.hasCreateButton).to.be.true;
        expect(ItemNoteTypes.hasEditButton).to.be.true;
        expect(ItemNoteTypes.hasDeleteButton).to.be.true;
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

    describe('viewing item note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/itemNoteTypes');
      });

      it('has a item note types list', () => {
        expect(ItemNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(ItemNoteTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, delete buttons', () => {
        expect(ItemNoteTypes.hasCreateButton).to.be.false;
        expect(ItemNoteTypes.hasEditButton).to.be.false;
        expect(ItemNoteTypes.hasDeleteButton).to.be.false;
      });
    });
  });
});
