import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';
import InventoryInteractor from '../../../interactors/inventory';
import { QUICK_EXPORT_LIMIT } from '../../../../../src/constants';

describe('Instances list', () => {
  setupApplication();

  const instancesRoute = new InstancesRouteInteractor();
  const inventory = new InventoryInteractor({
    timeout: 2000,
    scope: '[data-test-inventory-instances]',
  });
  const instancesAmount = 3;

  beforeEach(function () {
    for (let i = 0; i < instancesAmount; i++) {
      this.server.create('instance', {
        title: `Homo Deus: A Brief History of Tomorrow ${i + 1}`,
        contributors: [{ name: 'Yuval Noah Harari' }],
        metadata: {
          createdDate: '2020-03-04',
          updatedDate: '2020-04-15',
        },
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
        expect(inventory.headerDropdownMenu.isExportInstancesMARCBtnDisabled).to.be.true;
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
        expect(inventory.headerDropdownMenu.isExportInstancesMARCBtnDisabled).to.be.true;
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
          expect(inventory.headerDropdownMenu.isExportInstancesMARCBtnDisabled).to.be.false;
        });
      });

      describe('selecting more than one row', () => {
        beforeEach(async () => {
          await instancesRoute.selectRowCheckboxes(1).clickInput();
        });

        it('should display selected rows count message (plural form) in the sub header', () => {
          expect(instancesRoute.customPaneSub.text).to.equal('2 records selected');
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
