import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import IdentifierTypes from '../../../interactors/settings/identifier-types/identifier-types';

describe('Identifier types', () => {
  function mockData() {
    this.server.create('identifierType', {
      id : '3363cdb1-e644-446c-82a4-dc3a1d4395b9',
      name : 'ISBN',
      source : 'folio'
    });
    this.server.create('identifierType', {
      id : '526aa04d-9289-4511-8866-349299592c18',
      name : 'LCCN',
      source : 'folio'
    });
    this.server.create('identifierType', {
      id : '6312d172-f0cf-40f6-b27d-9fa8feaf332f',
      name : 'ISSN',
      source : 'folio'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.identifier-types': true
      }
    });

    beforeEach(mockData);
    describe('viewing identifier types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/identifiertypes');
      });

      it('has a identifier types list', () => {
        expect(IdentifierTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(IdentifierTypes.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(IdentifierTypes.hasCreateButton).to.be.true;
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
    describe('viewing identifier types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/identifiertypes');
      });

      it('has a identifier types list', () => {
        expect(IdentifierTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(IdentifierTypes.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(IdentifierTypes.hasCreateButton).to.be.false;
      });
    });
  });
});
