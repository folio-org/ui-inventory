import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import InvSettingsInteractor from '../../interactors/settings/index';


describe('Settings inventory page', () => {
  setupApplication();
  const invSettingsRoute = new InvSettingsInteractor();

  describe('User visit settings/inventory instances Alternative title types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/alternativeTitleTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleAlternative).to.equal('Alternative title types');
    });
  });

  describe('User visit settings/inventory instances Classification identifier types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/classificationTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleClassificationTypes).to.equal('Classification identifier types');
    });
  });

  describe('User visit settings/inventory instances Contributor types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/contributortypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleContributorTypes).to.equal('Contributor types');
    });
  });

  describe('User visit settings/inventory instances Formats', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/formats');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleFormats).to.equal('Formats');
    });
  });

  describe('User visit settings/inventory instances Note types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/instanceNoteTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleInstanceNoteTypes).to.equal('Instance note types');
    });
  });

  describe('User visit settings/inventory instances Status types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/instanceStatusTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleInstanceStatusTypes).to.equal('Instance status types');
    });
  });

  describe('User visit settings/inventory instances modes of issuance', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/modesOfIssuance');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleModeOfInssuance).to.equal('Modes of issuance');
    });
  });

  describe('User visit settings/inventory instances Nature Of Content', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/natureOfContentTerms');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleNatureOfContent).to.equal('Nature of content');
    });
  });

  describe('User visit settings/inventory instances Resourse Identifier types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/identifierTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleResourceIdentifierTypes).to.equal('Resource identifier types');
    });
  });

  describe('User visit settings/inventory instances resource types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/resourcetypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleInstanceResourceTypes).to.equal('Resource types');
    });
  });

  describe('User visit settings/inventory holdings note types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/holdingsNoteTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleHoldingsNoteTypes).to.equal('Holdings note types');
    });
  });

  describe('User visit settings/inventory holdings types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/holdingsTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleHoldingsTypes).to.equal('Holdings types');
    });
  });

  describe('User visit settings/inventory holdings ill police', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/ILLPolicy');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleHoldingsIllPolicy).to.equal('ILL policy');
    });
  });

  describe('User visit settings/inventory items note types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/itemNoteTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleItemsNoteTypes).to.equal('Item note types');
    });
  });

  describe('User visit settings/inventory items loan types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/loantypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleItemsLoanTypes).to.equal('Loan types');
    });
  });

  describe('User visit settings/inventory items material types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/materialtypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleItemsMaterialTypes).to.equal('Material types');
    });
  });

  describe('User visit settings/inventory statistical code types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/statisticalCodeTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleStaticticalCodeTypes).to.equal('Statistical code types');
    });
  });

  describe('User visit settings/inventory statistical codes', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/StatisticalCodeSettings');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleStaticticalCodes).to.equal('Statistical codes');
    });
  });

  describe('User visit settings/inventory URL relationship', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/URLrelationship');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleUrlRelationship).to.equal('URL relationship');
    });
  });

  describe('User visit settings/inventory Call Number Types', () => {
    beforeEach(async function () {
      this.visit('/settings/inventory/callNumberTypes');
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.isPresent).to.equal(true);
    });

    it('opens settings inventory route', () => {
      expect(invSettingsRoute.titleCallNumberTypes).to.equal('Call number types');
    });
  });
});
