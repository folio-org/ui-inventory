import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import HoldingsViewPage from '../interactors/holdings-view-page';
import HoldingsEditPage from '../interactors/holdings-edit-page';
import HoldingsCreatePage from '../interactors/holdings-create-page';

describe('HoldingsViewPage', () => {
  setupApplication();

  describe('holding record with items', () => {
    beforeEach(async function () {
      const instance = this.server.create(
        'instance',
        'withHoldingAndItem',
        'withStatisticalCodeIds',
        { title: 'Holding record' },
      );
      const holding = this.server.schema.instances.first().holdings.models[0];

      this.visit(`/inventory/view/${instance.id}/${holding.id}`);
      await HoldingsViewPage.whenLoaded();
    });

    it('displays the title in the pane header', () => {
      expect(HoldingsViewPage.title).to.equal('Instance record Holding record');
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

      it('should be displayed', () => {
        expect(HoldingsViewPage.hasExpandAll).to.be.true;
      });

      it('accordion should be open', () => {
        expect(HoldingsViewPage.administrativeDataAccordion.isOpen).to.be.true;
      });

      describe('accordion toggle', () => {
        beforeEach(async () => {
          await HoldingsViewPage.administrativeDataAccordion.clickHeader();
        });

        it('accordion should not be displayed', () => {
          expect(HoldingsViewPage.administrativeDataAccordion.isOpen).to.be.false;
        });
      });

      describe('statistical codes list', () => {
        it('has correct amount of items', () => {
          expect(HoldingsViewPage.statisticalCodesList.rowCount).to.be.equal(3);
        });
      });

      describe('holdings statements list', () => {
        it('has correct amount of items', () => {
          expect(HoldingsViewPage.holdingsStatementsList.rowCount).to.be.equal(1);
        });
      });

      describe('holdings statements for indexes list', () => {
        it('has correct amount of items', () => {
          expect(HoldingsViewPage.holdingsStatementsForIndexesList.rowCount).to.be.equal(2);
        });
      });

      describe('holdings statements for supplements list', () => {
        it('has correct amount of items', () => {
          expect(HoldingsViewPage.holdingsStatementsForSupplementsList.rowCount).to.be.equal(1);
        });
      });

      describe('holding notes list', () => {
        it('has correct amount of lists', () => {
          expect(HoldingsViewPage.notes().length).to.be.equal(1);
        });

        it('has correct amount of items', () => {
          expect(HoldingsViewPage.notes(0).rowCount).to.be.equal(2);
        });

        describe('has correct values', () => {
          it('first row - staff only: "Yes", note: is empty ', () => {
            expect(HoldingsViewPage.notes(0).rows(0).cells(0).content).to.be.equal('Yes');
            expect(HoldingsViewPage.notes(0).rows(0).cells(1).content).to.be.equal('-');
          });

          it('second row - staff only: "No", note: is not empty', () => {
            expect(HoldingsViewPage.notes(0).rows(1).cells(0).content).to.be.equal('No');
            expect(HoldingsViewPage.notes(0).rows(1).cells(1).content).to.be.a('string').that.not.empty;
          });
        });
      });

      describe('electronic access list', () => {
        it('has correct amount of items', () => {
          expect(HoldingsViewPage.electronicAccessList.rowCount).to.be.equal(1);
        });

        describe('has correct values', () => {
          describe('first row', () => {
            it('url relationship - should be "Resource"', () => {
              expect(HoldingsViewPage.electronicAccessList.rows(0).cells(0).content).to.be.equal('Resource');
            });

            it('uri - should be the link', () => {
              expect(HoldingsViewPage.electronicAccessList.rows(0).cells(1).content).to.match(/^http/);
            });

            it('link test - should be the text', () => {
              expect(HoldingsViewPage.electronicAccessList.rows(0).cells(2).content).to.be.a('string').that.not.empty;
            });

            it('materials specified - should be the text', () => {
              expect(HoldingsViewPage.electronicAccessList.rows(0).cells(3).content).to.be.a('string').that.not.empty;
            });

            it('url public note - should be dash', () => {
              expect(HoldingsViewPage.electronicAccessList.rows(0).cells(4).content).to.be.equal('-');
            });
          });
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
