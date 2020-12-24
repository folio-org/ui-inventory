import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';
import InventoryInteractor from '../../../interactors/inventory';
import SelectedRecordsModalInteractor from '../../../interactors/selected-records-modal';
import { QUICK_EXPORT_LIMIT } from '../../../../../src/constants';

describe('Instances list', () => {
  setupApplication();

  const instancesRoute = new InstancesRouteInteractor();
  const inventory = new InventoryInteractor({
    timeout: 2000,
    scope: '[data-test-inventory-instances]',
  });
  const instancesAmount = 3;
  const selectedRecordsModalInteractor = new SelectedRecordsModalInteractor();

  beforeEach(function () {
    for (let i = 0; i < instancesAmount; i++) {
      this.server.create('instance', {
        title: `Homo Deus: A Brief History of Tomorrow ${i + 1}`,
        contributors: [{ name: 'Yuval Noah Harari' }],
        metadata: {
          createdDate: '2020-03-04',
          updatedDate: '2020-04-15',
        },
        publication:[{
          dateOfPublication: 'c2004',
          place: 'Cambridge, Mass. ',
          publisher: 'MIT Press',
          role: 'Publisher',
        }],
        source: 'MARC',
      }, 'withHoldingAndItem');
    }

    this.visit('/inventory');
  });

  describe('opening the action menu', () => {
    beforeEach(async () => {
      await inventory.headerDropdown.click();
    });

    it('should not display warning about exceeded limit', () => {
      expect(inventory.headerDropdownMenuQuickMarcExportLimitExceeded.isPresent).to.be.false;
    });
  });

  describe('filtering by source', () => {
    beforeEach(async () => {
      await inventory.source.open();
      await inventory.source.checkboxes.dataOptions(5).click();
    });

    it('should have proper list results size', () => {
      expect(instancesRoute.rows().length).to.equal(instancesAmount);
    });

    it('should render nothing for select row column header', () => {
      expect(instancesRoute.headers(0).text).to.equal('');
    });

    it('should display unchecked select row checkbox', () => {
      expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.false;
    });

    it('should not display information about selected items', () => {
      expect(instancesRoute.customPaneSub.isPresent).to.be.false;
    });

    describe('opening the action menu', () => {
      beforeEach(async () => {
        await inventory.headerDropdown.click();
      });

      it('should disable action button for export instances (MARC) if there are no selected rows', () => {
        expect(inventory.headerDropdownMenu.exportInstancesMARCBtn.$root.disabled).to.be.true;
      });

      it('should disable action button for showing selected records if there are no selected rows', () => {
        expect(inventory.headerDropdownMenu.showSelectedRecordsBtn.$root.disabled).to.be.true;
      });
    });

    describe('selecting rows to exceed the quick export limit', () => {
      beforeEach(async () => {
        await instancesRoute.selectRowCheckboxes(0).clickInput();
        await instancesRoute.selectRowCheckboxes(1).clickInput();
        await instancesRoute.selectRowCheckboxes(2).clickInput();
        await inventory.headerDropdown.click();
      });

      it('should display warning about exceeded limit', () => {
        expect(inventory.headerDropdownMenuQuickMarcExportLimitExceeded.text).to.equal(`Selected record limit of ${QUICK_EXPORT_LIMIT} exceeded`);
      });

      it('should disable action button for export instances (MARC)', () => {
        expect(inventory.headerDropdownMenu.exportInstancesMARCBtn.$root.disabled).to.be.true;
      });
    });

    describe('selecting row', () => {
      beforeEach(async () => {
        await instancesRoute.selectRowCheckboxes(0).clickInput();
      });

      it('should have proper list results size', () => {
        expect(instancesRoute.rows().length).to.equal(instancesAmount);
      });

      it('should display checked select row checkbox', () => {
        expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.true;
      });

      it('should display selected rows count message in the sub header', () => {
        expect(instancesRoute.customPaneSub.text).to.equal('1 record selected');
      });

      describe('opening the action menu', () => {
        beforeEach(async () => {
          await inventory.headerDropdown.click();
        });

        it('should enable action button for export instances (MARC) when there are selected rows', () => {
          expect(inventory.headerDropdownMenu.exportInstancesMARCBtn.$root.disabled).to.be.false;
        });

        describe('clicking on show selected records action button', () => {
          beforeEach(async () => {
            await inventory.headerDropdownMenu.showSelectedRecordsBtn.click();
          });

          it('should open selected records modal', () => {
            expect(selectedRecordsModalInteractor.isPresent).to.be.true;
          });

          it('should display correct amount of records in modal', () => {
            expect(selectedRecordsModalInteractor.selectedRecordsList.rowCount).to.equal(1);
          });

          it('should display correct data in list', () => {
            expect(selectedRecordsModalInteractor.selectedRecordsList.rows(0).cells(0).content).to.be.equal('Homo Deus: A Brief History of Tomorrow 1');
            expect(selectedRecordsModalInteractor.selectedRecordsList.rows(0).cells(1).content).to.be.equal('Yuval Noah Harari');
            expect(selectedRecordsModalInteractor.selectedRecordsList.rows(0).cells(2).content).to.be.equal('MIT Press (c2004)');
          });

          describe('clicking cancel button in selected records modal', async () => {
            await selectedRecordsModalInteractor.cancelButton.click();

            it('should close the modal', () => {
              expect(selectedRecordsModalInteractor.isPresent).to.be.false;
            });
          });
        });
      });

      describe('selecting more than one row', () => {
        beforeEach(async () => {
          await instancesRoute.selectRowCheckboxes(1).clickInput();
        });

        it('should display selected rows count message (plural form) in the sub header', () => {
          expect(instancesRoute.customPaneSub.text).to.equal('2 records selected');
        });

        describe('clicking on export instances (MARC) button', () => {
          beforeEach(async () => {
            await inventory.headerDropdownMenu.exportInstancesMARCBtn.click();
          });

          it('should not display error callout', () => {
            expect(inventory.callout.errorCalloutIsPresent).to.be.false;
          });
        });

        describe('clicking on export instances (MARC) button with API request set up to fail', () => {
          beforeEach(async function () {
            this.server.post('/data-export/quick-export', {}, 500);

            await inventory.headerDropdownMenu.exportInstancesMARCBtn.click();
          });

          it('should display error callout', () => {
            expect(inventory.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });

      describe('clicking on reset all button and reapplying previous filter', () => {
        beforeEach(async () => {
          await inventory.resetAll();
          await inventory.source.open();
          await inventory.source.checkboxes.dataOptions(5).click();
        });

        it('should reset the selected state for the previously selected row', () => {
          expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.false;
        });

        it('should reset selected rows count message in the subheader by hiding it', () => {
          expect(instancesRoute.customPaneSub.isPresent).to.be.false;
        });
      });

      describe('applying filters so previously selected items are no longer displayed', () => {
        beforeEach(async () => {
          await inventory.source.open();
          await inventory.source.checkboxes.dataOptions(5).click();
        });

        it('should have no results', () => {
          expect(instancesRoute.rows().length).to.equal(0);
        });

        it('should display selected rows count message in the sub header', () => {
          expect(instancesRoute.customPaneSub.text).to.equal('1 record selected');
        });

        describe('applying filters so previously selected items is displayed again', () => {
          beforeEach(async () => {
            await inventory.source.open();
            await inventory.source.checkboxes.dataOptions(5).click();
          });

          it('should preserve the selected state for the previously selected row', () => {
            expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.true;
          });

          it('should display selected rows count message in the sub header', () => {
            expect(instancesRoute.customPaneSub.text).to.equal('1 record selected');
          });
        });
      });
    });
  });
});
