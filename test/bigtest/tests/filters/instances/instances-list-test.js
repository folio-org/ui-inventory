import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import InstancesRouteInteractor from '../../../interactors/routes/instances-route';
import InventoryInteractor from '../../../interactors/inventory';

describe('Instances list', () => {
  setupApplication();

  const instancesRoute = new InstancesRouteInteractor();
  const inventory = new InventoryInteractor({
    timeout: 3000,
    scope: '[data-test-inventory-instances]',
  });

  beforeEach(function () {
    this.server.create('instance', {
      title: 'Homo Deus: A Brief History of Tomorrow',
      contributors: [{ name: 'Yuval Noah Harari' }],
      metadata: {
        createdDate: '2020-03-04',
        updatedDate: '2020-04-15',
      },
      source: 'MARC',
    }, 'withHoldingAndItem');
    this.server.create('instance', {
      title: 'A Brief History of Tomorrow',
      contributors: [{ name: 'Yuval Noah Harari' }],
      metadata: {
        createdDate: '2020-03-04',
        updatedDate: '2020-04-15',
      },
      source: 'MARC',
    }, 'withHoldingAndItem');

    this.visit('/inventory');
  });

  describe('filtering by source', () => {
    beforeEach(async () => {
      await inventory.source.open();
      await inventory.source.checkboxes.dataOptions(5).click();
    });

    it('should have proper list results size', () => {
      expect(instancesRoute.rows().length).to.equal(2);
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

    describe('selecting row', () => {
      beforeEach(async () => {
        await instancesRoute.selectRowCheckboxes(0).clickInput();
      });

      it('should have proper list results size', () => {
        expect(instancesRoute.rows().length).to.equal(2);
      });

      it('should display checked select row checkbox', () => {
        expect(instancesRoute.selectRowCheckboxes(0).isChecked).to.be.true;
      });

      it('should display selected rows count message in the sub header', () => {
        expect(instancesRoute.customPaneSub.text).to.equal('1 record selected');
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
