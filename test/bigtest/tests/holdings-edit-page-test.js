import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import HoldingsEditPage from '../interactors/holdings-edit-page';
import InstanceViewPage from '../interactors/instance-view-page';

describe('HoldingsEditPage', () => {
  setupApplication();

  let instance;
  const holdings = {
    id: '999',
    formerIds: [],
    instanceId: '',
    permanentLocationId: '',
    electronicAccess: [],
    callNumber: '',
    notes: [],
    holdingsStatements: [],
    holdingsStatementsForIndexes: [],
    holdingsStatementsForSupplements: [],
    holdingsItems: []
  };

  beforeEach(async function () {
    instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH',
    });

    this.server.get('/holdings-storage/holdings/:id', holdings);
    this.server.get('/locations/:id', {});
    this.visit(`/inventory/view/${instance.id}/${holdings.id}?layer=editHoldingsRecord`);

    await HoldingsEditPage.whenLoaded();
  });

  it('displays the holdings name in the pane header', () => {
    expect(HoldingsEditPage.title).to.equal('Instance record ADVANCING RESEARCH');
  });

  describe('clicking on cancel', () => {
    beforeEach(async () => {
      await HoldingsEditPage.clickCancel();
      await InstanceViewPage.whenLoaded();
    });

    it('should redirect to instance view page after click', () => {
      expect(InstanceViewPage.$root).to.exist;
    });
  });
});
