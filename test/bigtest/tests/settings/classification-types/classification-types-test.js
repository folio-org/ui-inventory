import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import ClassificationTypes from '../../../interactors/settings/classification-types/classification-types';

describe('Classification types', () => {
  setupApplication();

  beforeEach(function () {
    this.server.create('classificationType', {
      id : '3363cdb1-e644-446c-82a4-dc3a1d4395b9',
      name : 'ISBN',
      source : 'folio'
    });
    this.server.create('classificationType', {
      id : '526aa04d-9289-4511-8866-349299592c18',
      name : 'LCCN',
      source : 'folio'
    });
    this.server.create('classificationType', {
      id : '6312d172-f0cf-40f6-b27d-9fa8feaf332f',
      name : 'ISSN',
      source : 'folio'
    });
  });
  describe('viewing classification types list', () => {
    beforeEach(function () {
      this.visit('/settings/inventory/classificationtypes');
    });

    it('has a classification types list', () => {
      expect(ClassificationTypes.hasList).to.be.true;
    });

    it('list has 3 items', () => {
      expect(ClassificationTypes.rowCount).to.equal(3);
    });
  });
});
