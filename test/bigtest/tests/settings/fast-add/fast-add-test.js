import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import FastAddSettings from '../../../interactors/settings/fast-add/fast-add';
import translation from '../../../../../translations/ui-inventory/en';

describe('Settings page for Fast add', () => {
  setupApplication();

  beforeEach(function () {
    this.server.createList('instance-status', 3);

    this.visit('/settings/inventory/fastAdd');
  });

  it('should be present', () => {
    expect(FastAddSettings.isPresent).to.be.true;
  });

  it('selectors should have correct labels', () => {
    expect(FastAddSettings.defaultInstanceStatus.label).to.equal(translation.defaultInstanceStatus);
    expect(FastAddSettings.defaultDiscoverySuppress.label).to.equal(translation.defaultDiscoverySuppress);
  });

  it('both buttons should be disabled', () => {
    expect(FastAddSettings.submitFormButtonDisabled).to.be.true;
    expect(FastAddSettings.cancelFormButtonDisabled).to.be.true;
  });

  describe('selecting the value', () => {
    beforeEach(async () => {
      await FastAddSettings.defaultDiscoverySuppress.selectAndBlur(translation.no);
    });

    it('both buttons should be enabled', () => {
      expect(FastAddSettings.submitFormButtonDisabled).to.be.false;
      expect(FastAddSettings.cancelFormButtonDisabled).to.be.false;
    });
  });
});
