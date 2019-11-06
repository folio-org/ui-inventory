import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstanceNoteTypes from '../../../interactors/settings/instance-note-types/instance-note-types';

describe('Instance note types', () => {
  function mockData() {
    this.server.create('instanceNoteType', {
      'id' : '6a2533a7-4de2-4e64-8466-074c2fa9308c',
      'name' : 'General note',
      'source' : 'folio'
    });
    this.server.create('instanceNoteType', {
      'id' : '1c017b8d-c783-4f63-b620-079f7a5b9c07',
      'name' : 'Action note',
      'source' : 'folio'
    });
    this.server.create('instanceNoteType', {
      'id' : 'e8cdc2fe-c53c-478a-a7f3-47f2fc79c6d4',
      'name' : 'Awards note',
      'source' : 'folio'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.instance-note-types': true
      }
    });

    beforeEach(mockData);

    describe('viewing instance note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/instanceNoteTypes');
      });

      it('has a instance note types list', () => {
        expect(InstanceNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(InstanceNoteTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, delete buttons', () => {
        expect(InstanceNoteTypes.hasCreateButton).to.be.true;
        expect(InstanceNoteTypes.hasEditButton).to.be.true;
        expect(InstanceNoteTypes.hasDeleteButton).to.be.true;
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
        await this.visit('/settings/inventory/instanceNoteTypes');
      });

      it('has an altenative title types list', () => {
        expect(InstanceNoteTypes.hasList).to.be.false;
      });
    });
  });

  describe('User doesnot have permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true
      }
    });

    beforeEach(mockData);

    describe('viewing instance note types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/instanceNoteTypes');
      });

      it('has a instance note types list', () => {
        expect(InstanceNoteTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(InstanceNoteTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, delete buttons', () => {
        expect(InstanceNoteTypes.hasCreateButton).to.be.false;
        expect(InstanceNoteTypes.hasEditButton).to.be.false;
        expect(InstanceNoteTypes.hasDeleteButton).to.be.false;
      });
    });
  });
});
