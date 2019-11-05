import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import NatureOfContentTerms from '../../../interactors/settings/nature-of-content-terms/nature-of-content-terms';

describe('Nature of content terms', () => {
  function mockData() {
    this.server.create('natureOfContentTerm', {
      'id': '96879b60-098b-453b-bf9a-c47866f1ab2a',
      'name': 'audiobook',
      'source': 'folio'
    });
    this.server.create('natureOfContentTerm', {
      'id': 'b6e214bd-82f5-467f-af5b-4592456dc4ab',
      'name': 'biography',
      'source': 'folio'
    });
    this.server.create('natureOfContentTerm', {
      'id': 'ebbbdef1-00e1-428b-bc11-314dc0705074',
      'name': 'newspaper',
      'source': 'folio'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.nature-of-content-terms': true
      }
    });

    beforeEach(mockData);
    describe('viewing content terms list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/natureOfContentTerms');
      });

      it('has a content terms list', () => {
        expect(NatureOfContentTerms.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(NatureOfContentTerms.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(NatureOfContentTerms.hasNewButton).to.be.true;
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
        await this.visit('/settings/inventory/natureOfContentTerms');
      });

      it('has an altenative title types list', () => {
        expect(NatureOfContentTerms.hasList).to.be.false;
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
    describe('viewing content terms list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/natureOfContentTerms');
      });

      it('has a content terms list', () => {
        expect(NatureOfContentTerms.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(NatureOfContentTerms.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(NatureOfContentTerms.hasNewButton).to.be.false;
      });
    });
  });
});
