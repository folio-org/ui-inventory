import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ModesOfIssuance from '../../../interactors/settings/modes-of-issuance/modes-of-issuance';

describe('Modes of issuance', () => {
  setupApplication();

  beforeEach(function () {
    this.server.create('issuance-mode', {
      id : '3363cdb1-e644-446c-82a4-dc3a1d4395b9',
      name : 'Monograph',
      source : 'rdamodeissue'
    });
    this.server.create('issuance-mode', {
      id : '526aa04d-9289-4511-8866-349299592c18',
      name : 'Serial',
      source : 'rdamodeissue'
    });
    this.server.create('issuance-mode', {
      id : '6312d172-f0cf-40f6-b27d-9fa8feaf332f',
      name : 'Other',
      source : 'rdamodeissue'
    });
  });
  describe('viewing modes of issuance list', () => {
    beforeEach(function () {
      this.visit('/settings/inventory/modesofissuance');
    });

    it('has a modes of issuance list', () => {
      expect(ModesOfIssuance.hasList).to.be.true;
    });

    it('list has 3 items', () => {
      expect(ModesOfIssuance.rowCount).to.equal(3);
    });
  });
});
