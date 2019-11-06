import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceCreatePage from '../interactors/instance-create-page';
import ItemViewPage from '../interactors/item-view-page';
import HoldingsViewPage from '../interactors/holdings-view-page';

import translation from '../../../translations/ui-inventory/en';

describe('InstanceViewPage', () => {
  const visitingViewInventoryPage = () => {
    beforeEach(async function () {
      const instance = this.server.create('instance', 'withHoldingAndItem', {
        title: 'ADVANCING RESEARCH',
      });
      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });
  };

  describe('User has permissions', () => {
    setupApplication({ scenarios: ['fetch-items-success'] });

    visitingViewInventoryPage();

    it('should be displayed', () => {
      expect(InstanceViewPage.hasExpandAll).to.be.true;
    });

    describe('collapse all clicked', () => {
      beforeEach(async () => {
        await InstanceViewPage.expandAll.click();
      });

      it('accordion should not be displayed', () => {
        expect(InstanceViewPage.accordion.isOpen).to.be.false;
      });

      describe('expand all', () => {
        beforeEach(async () => {
          await InstanceViewPage.expandAll.click();
        });

        it('accordion should be displayed', () => {
          expect(InstanceViewPage.accordion.isOpen).to.be.true;
        });
      });
    });

    it('should be collapse all button displayed', () => {
      expect(InstanceViewPage.hasExpandAll).to.be.true;
    });

    it('displays the instance headline under header', () => {
      expect(InstanceViewPage.headlineInViewInstance).to.be.true;
    });

    it('displays the clickable edit button near the header', () => {
      expect(InstanceViewPage.hasButtonEditInstance).to.be.true;
    });

    it('displays the instance title in the pane header', () => {
      expect(InstanceViewPage.title).to.equal('Instance record ADVANCING RESEARCH');
    });

    it('should render a View holdings button at the bottom of opened instance', () => {
      expect(InstanceViewPage.hasViewHoldingsButton).to.be.true;
    });

    describe('pane header dropdown menu', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdown.click();
      });

      it('should render a edit instance button at the bottom of opened instance', () => {
        expect(InstanceViewPage.headerDropdownMenu.hasEditButton).to.be.true;
      });

      it('should render a duplicate instance button at the bottom of opened instance', () => {
        expect(InstanceViewPage.headerDropdownMenu.hasDuplicateButton).to.be.true;
      });

      it('should render an add item button', () => {
        expect(InstanceViewPage.hasButtonAddItem).to.be.true;
      });

      it('should render an add holdings button', () => {
        expect(InstanceViewPage.hasButtonAddHoldings).to.be.true;
      });

      describe('clicking on edit', () => {
        beforeEach(async () => {
          await InstanceViewPage.headerDropdownMenu.clickEdit();
        });

        it('should redirect to instance edit page', () => {
          expect(InstanceEditPage.$root).to.exist;
        });
      });

      describe('clicking on duplicate', () => {
        beforeEach(async () => {
          await InstanceViewPage.headerDropdownMenu.clickDuplicate();
        });

        it('should redirect to instance create page', () => {
          expect(InstanceCreatePage.$root).to.exist;
        });

        it('should have a source value of "FOLIO"', () => {
          expect(InstanceCreatePage.sourceValue).to.equal('FOLIO');
        });
      });
    });

    describe('subject list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.subjectsList.rowCount).to.be.equal(1);
      });
    });

    describe('series statement list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.seriesStatementList.rowCount).to.be.equal(1);
      });
    });

    describe('items per holdings', () => {
      it('has correct amount of columns', () => {
        expect(InstanceViewPage.itemsList.columnCount).to.be.equal(5);
      });

      it('renders correct header captions', () => {
        expect(InstanceViewPage.itemsList.headers(0).text).to.be.equal(translation['item.barcode']);
        expect(InstanceViewPage.itemsList.headers(1).text).to.be.equal(translation.status);
        expect(InstanceViewPage.itemsList.headers(2).text).to.be.equal(translation.materialType);
        expect(InstanceViewPage.itemsList.headers(3).text).to.be.equal(translation.enumeration);
        expect(InstanceViewPage.itemsList.headers(4).text).to.be.equal(translation.chronology);
      });

      describe('sorting', () => {
        describe('compares by `Item: barcode` field', () => {
          beforeEach(async () => {
            await InstanceViewPage.itemsList.headers(0).click();
          });

          it('ascending', () => {
            expect(InstanceViewPage.getCellContent(0, 0)).to.equal('40875104574');
            expect(InstanceViewPage.getCellContent(1, 0)).to.equal('5860825104574');
            expect(InstanceViewPage.getCellContent(2, 0)).to.equal('60825104574');
          });

          describe('and', () => {
            beforeEach(async () => {
              await InstanceViewPage.itemsList.headers(0).click();
            });

            it('descending', () => {
              expect(InstanceViewPage.getCellContent(0, 0)).to.equal('60825104574');
              expect(InstanceViewPage.getCellContent(1, 0)).to.equal('5860825104574');
              expect(InstanceViewPage.getCellContent(2, 0)).to.equal('40875104574');
            });
          });
        });
        describe('compares by `Status` field', () => {
          beforeEach(async () => {
            await InstanceViewPage.itemsList.headers(1).click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, 1)).to.equal('Paged');
            expect(InstanceViewPage.getCellContent(1, 1)).to.equal('Checked out');
            expect(InstanceViewPage.getCellContent(2, 1)).to.equal('Available');
          });

          describe('and', () => {
            beforeEach(async () => {
              await InstanceViewPage.itemsList.headers(1).click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, 1)).to.equal('Available');
              expect(InstanceViewPage.getCellContent(1, 1)).to.equal('Checked out');
              expect(InstanceViewPage.getCellContent(2, 1)).to.equal('Paged');
            });
          });
        });
        describe('compares by `Material type` field', () => {
          beforeEach(async () => {
            await InstanceViewPage.itemsList.headers(2).click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, 2)).to.equal('text');
            expect(InstanceViewPage.getCellContent(1, 2)).to.equal('book');
            expect(InstanceViewPage.getCellContent(2, 2)).to.equal('book');
          });

          describe('and', () => {
            beforeEach(async () => {
              await InstanceViewPage.itemsList.headers(2).click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, 2)).to.equal('book');
              expect(InstanceViewPage.getCellContent(1, 2)).to.equal('book');
              expect(InstanceViewPage.getCellContent(2, 2)).to.equal('text');
            });
          });
        });
        describe('compares by `Enumeration` field', () => {
          beforeEach(async () => {
            await InstanceViewPage.itemsList.headers(3).click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, 3)).to.equal('v.73:no.1-6');
            expect(InstanceViewPage.getCellContent(1, 3)).to.equal('v.72:no.1-6');
            expect(InstanceViewPage.getCellContent(2, 3)).to.equal('v.70:no.7-12');
          });

          describe('and', () => {
            beforeEach(async () => {
              await InstanceViewPage.itemsList.headers(3).click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, 3)).to.equal('v.70:no.7-12');
              expect(InstanceViewPage.getCellContent(1, 3)).to.equal('v.72:no.1-6');
              expect(InstanceViewPage.getCellContent(2, 3)).to.equal('v.73:no.1-6');
            });
          });
        });
        describe('compares by `Chronology` field', () => {
          beforeEach(async () => {
            await InstanceViewPage.itemsList.headers(4).click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, 4)).to.equal('1987:Jan.-June');
            expect(InstanceViewPage.getCellContent(1, 4)).to.equal('1986:Jan.-June');
            expect(InstanceViewPage.getCellContent(2, 4)).to.equal('1984:July-Dec.');
          });

          describe('and', () => {
            beforeEach(async () => {
              await InstanceViewPage.itemsList.headers(4).click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, 4)).to.equal('1984:July-Dec.');
              expect(InstanceViewPage.getCellContent(1, 4)).to.equal('1986:Jan.-June');
              expect(InstanceViewPage.getCellContent(2, 4)).to.equal('1987:Jan.-June');
            });
          });
        });
      });

      it('should render an app icon for each item in the items list', () => {
        expect(InstanceViewPage.items(0).hasAppIcon).to.be.true;
      });

      it('should render a copy icon for each item in the item list', () => {
        expect(InstanceViewPage.items(0).hasCopyIcon).to.be.true;
      });

      it('should render a link for each item in the items list', () => {
        expect(InstanceViewPage.items(0).hasBarcodeLink).to.be.true;
      });

      describe('clicking item link', () => {
        beforeEach(async () => {
          await InstanceViewPage.items(0).clickBarcode();
        });

        it('should redirect to item view page', () => {
          expect(ItemViewPage.$root).to.exist;
        });
      });

      describe('clicking view holdings button', () => {
        beforeEach(async () => {
          await InstanceViewPage.clickViewHoldings();
        });

        it('should redirect to holding view page', () => {
          expect(HoldingsViewPage.$root).to.exist;
        });
      });

      describe('clicking add holdings button', () => {
        beforeEach(async () => {
          await InstanceViewPage.clickButtonAddHoldings();
        });

        it('should redirect to holding view page', () => {
          expect(HoldingsViewPage.$root).to.exist;
        });
      });

      describe('clicking add item button', () => {
        beforeEach(async () => {
          await InstanceViewPage.clickButtonAddItem();
        });

        it('should redirect to item view page', () => {
          expect(ItemViewPage.$root).to.exist;
        });
      });

      describe('clicking edit instance button', () => {
        beforeEach(async () => {
          await InstanceViewPage.clickEditInstance();
        });

        it('should redirect to instance edit page', () => {
          expect(InstanceEditPage.$root).to.exist;
        });
      });
    });
  });

  describe('User does not have permissions', () => {
    setupApplication({
      hasAllPerms: false,
      permissions: {
        'module.inventory.enabled': true,
        'ui-inventory.instance.view': true,
      }
    });

    visitingViewInventoryPage();

    it('displays the clickable edit button near the header', () => {
      expect(InstanceViewPage.hasButtonEditInstance).to.be.false;
    });

    it('should render a edit instance button at the bottom of opened instance', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasEditButton).to.be.false;
    });

    it('should render a duplicate instance button at the bottom of opened instance', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasDuplicateButton).to.be.false;
    });

    it('should render an view source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasViewSourceButton).to.be.false;
    });

    it('should render an add item button', () => {
      expect(InstanceViewPage.hasButtonAddItem).to.be.false;
    });

    it('should render an add holdings button', () => {
      expect(InstanceViewPage.hasButtonAddHoldings).to.be.false;
    });
  });

  describe('Preceding and succeding titles', () => {
    setupApplication();
    beforeEach(async function () {
      this.server.create('instanceRelationshipType', {
        'id': '7531246',
        'name': 'preceding-succeeding',
      });
      const instance = this.server.create('instance', {
        title: 'ADVANCING RESEARCH',
        parentInstances: [{
          id: '10101010101',
          superInstanceId: '130400000',
          instanceRelationshipTypeId: '7531246',
        }],
        childInstances: [{
          id: '10101010101',
          subInstanceId: '130400000',
          instanceRelationshipTypeId: '7531246',
        }],
      });

      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });

    it('should show preceding title', () => {
      expect(InstanceViewPage.hasPrecedingTitles).to.be.true;
    });
    it('should show succeding title', () => {
      expect(InstanceViewPage.hasSucceedingTitles).to.be.true;
    });
  });
});
