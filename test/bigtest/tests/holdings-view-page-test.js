import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import HoldingsViewPage from '../interactors/holdings-view-page';
import HoldingsEditPage from '../interactors/holdings-edit-page';
import HoldingsCreatePage from '../interactors/holdings-create-page';

describe('HoldingsViewPage', () => {
  setupApplication();

  describe('holding record with items', () => {
    beforeEach(function () {
      const instance = this.server.create(
        'instance',
        'withHoldingAndItem',
        {
          title: 'Holding record',
        }
      );
      const holding = this.server.schema.instances.first().holdings.models[0];

      this.visit(`/inventory/view/${instance.id}/${holding.id}`);
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
          expect(HoldingsViewPage.confirmDeleteModalIsPresent).to.equal(false);
          expect(HoldingsViewPage.noDeleteHoldingsRecordModalIsVisible).to.equal(true);
        });
      });
    });
  });

  describe('holding record without items', () => {
    beforeEach(function () {
      const instance = this.server.create('instance', 'withHolding');
      const holding = this.server.schema.instances.first().holdings.models[0];
      this.visit(`/inventory/view/${instance.id}/${holding.id}`);
    });

    describe('clicking on delete', () => {
      beforeEach(async () => {
        await HoldingsViewPage.headerDropdownMenu.clickDelete();
      });

      it('should open delete confirmation modal', () => {
        expect(HoldingsViewPage.confirmDeleteModalIsVisible).to.equal(true);
        expect(HoldingsViewPage.noDeleteHoldingsRecordModalIsPresent).to.equal(false);
      });
    });
  });
});
