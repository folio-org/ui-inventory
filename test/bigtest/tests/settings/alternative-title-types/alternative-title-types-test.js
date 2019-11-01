import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import AlternativeTitleTypes from '../../../interactors/settings/alternative-title-types/alternative-title-types';

describe('Alternative title types', () => {
  function mockData() {
    this.server.create('alternativeTitleType', {
      'id' : '2ca8538d-a2fd-4e60-b967-1cb220101e22',
      'name' : 'Added title page title',
      'source' : 'folio'
    });
    this.server.create('alternativeTitleType', {
      'id' : '432ca81a-fe4d-4249-bfd3-53388725647d',
      'name' : 'Caption title',
      'source' : 'folio'
    });
    this.server.create('alternativeTitleType', {
      'id' : '5c364ce4-c8fd-4891-a28d-bb91c9bcdbfb',
      'name' : 'Cover title',
      'source' : 'folio'
    });
  }
  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.alternative-title-types': true
      }
    });

    beforeEach(mockData);

    describe('viewing alternative title types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/alternativeTitleTypes');
      });

      it('has an altenative title types list', () => {
        expect(AlternativeTitleTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(AlternativeTitleTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, create buttons', () => {
        expect(AlternativeTitleTypes.hasNewButton).to.be.true;
        expect(AlternativeTitleTypes.hasEditButton).to.be.true;
        expect(AlternativeTitleTypes.hasDeleteButton).to.be.true;
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

    describe('viewing alternative title types list', () => {
      beforeEach(async function () {
        await this.visit('/settings/inventory/alternativeTitleTypes');
      });

      it('has an altenative title types list', () => {
        expect(AlternativeTitleTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(AlternativeTitleTypes.rowCount).to.equal(3);
      });

      it('list has new, edit, create buttons', () => {
        expect(AlternativeTitleTypes.hasNewButton).to.be.false;
        expect(AlternativeTitleTypes.hasEditButton).to.be.false;
        expect(AlternativeTitleTypes.hasDeleteButton).to.be.false;
      });
    });
  });
});
