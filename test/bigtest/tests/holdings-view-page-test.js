import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import HoldingsViewPage from '../interactors/holdings-view-page';
import HoldingsEditPage from '../interactors/holdings-edit-page';
import HoldingsCreatePage from '../interactors/holdings-create-page';

describe('HoldingsViewPage', () => {
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

  beforeEach(function () {
    instance = this.server.create('instance');

    this.server.get('/holdings-storage/holdings/:id', holdings);
    this.server.get('/locations/:id', {});

    this.visit(`/inventory/view/${instance.id}/${holdings.id}`);
  });

  it('displays the title in the pane header', () => {
    expect(HoldingsViewPage.title).to.equal('Holding record');
  });

  describe('pane header dropdown menu', () => {
    beforeEach(async () => {
      await HoldingsViewPage.headerDropdown.click();
    });

    describe('clicking on edit', () => {
      beforeEach(async () => {
        await HoldingsViewPage.headerDropdownMenu.clickEdit();
      });

      it('should redirect to holdings edit page', () => {
        expect(HoldingsEditPage.$root).to.exist;
      });
    });

    describe('clicking on duplicate', () => {
      beforeEach(async () => {
        await HoldingsViewPage.headerDropdownMenu.clickDuplicate();
      });

      it('should redirect to holdings create page', () => {
        expect(HoldingsCreatePage.$root).to.exist;
      });
    });

    describe('clicking on delete', () => {
      beforeEach(async () => {
        await HoldingsViewPage.headerDropdownMenu.clickDelete();
      });

      it('should open delete confirmation modal', () => {
        expect(HoldingsViewPage.hasConfirmDeleteModal).to.exist;
      });
    });
  });
});
