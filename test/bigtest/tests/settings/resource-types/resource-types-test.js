import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstanceTypes from '../../../interactors/settings/resource-types/instance-types';

describe('Resource types (instance types)', () => {
  function mockData() {
    this.server.create('instanceType', {
      id : '3363cdb1-e644-446c-82a4-dc3a1d4395b9',
      name : 'cartographic dataset',
      code : 'crd',
      source : 'rdacontent'
    });
    this.server.create('instanceType', {
      id : '526aa04d-9289-4511-8866-349299592c18',
      name : 'cartographic image',
      code : 'cri',
      source : 'rdacontent'
    });
    this.server.create('instanceType', {
      id : '6312d172-f0cf-40f6-b27d-9fa8feaf332f',
      name : 'text',
      code : 'txt',
      source : 'rdacontent'
    });
  }

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true,
        'ui-inventory.settings.instance-types': true
      }
    });

    beforeEach(mockData);
    describe('viewing resource types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/resourcetypes');
      });

      it('has a resource types list', () => {
        expect(InstanceTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(InstanceTypes.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(InstanceTypes.hasNewButton).to.be.true;
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
        await this.visit('/settings/inventory/resourcetypes');
      });

      it('has an altenative title types list', () => {
        expect(InstanceTypes.hasList).to.be.false;
      });
    });
  });

  describe('User has permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'settings.inventory.enabled': true,
        'ui-inventory.settings.list.view': true
      }
    });

    beforeEach(mockData);
    describe('viewing resource types list', () => {
      beforeEach(function () {
        this.visit('/settings/inventory/resourcetypes');
      });

      it('has a resource types list', () => {
        expect(InstanceTypes.hasList).to.be.true;
      });

      it('list has 3 items', () => {
        expect(InstanceTypes.rowCount).to.equal(3);
      });

      it('list has new button', () => {
        expect(InstanceTypes.hasNewButton).to.be.false;
      });
    });
  });
});
