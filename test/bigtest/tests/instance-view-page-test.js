import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';
import InstanceCreatePage from '../interactors/instance-create-page';
import ItemViewPage from '../interactors/item-view-page';
import HoldingsViewPage from '../interactors/holdings-view-page';
import ItemCreatePage from '../interactors/item-create-page';

import translation from '../../../translations/ui-inventory/en';

const headersMap = {
  BARCODE: InstanceViewPage.itemsList.headers(0),
  STATUS: InstanceViewPage.itemsList.headers(1),
  COPY_NUMBER: InstanceViewPage.itemsList.headers(2),
  LOAN_TYPE: InstanceViewPage.itemsList.headers(3),
  EFFECTIVE_LOCATION: InstanceViewPage.itemsList.headers(4),
  ENUMERATION: InstanceViewPage.itemsList.headers(5),
  CHRONOLOGY: InstanceViewPage.itemsList.headers(6),
  VOLUME: InstanceViewPage.itemsList.headers(7),
  YEAR: InstanceViewPage.itemsList.headers(8),
  MATERIAL_TYPE: InstanceViewPage.itemsList.headers(9),
};
const headersIndex = {
  BARCODE: 0,
  STATUS: 1,
  COPY_NUMBER: 2,
  LOAN_TYPE: 3,
  EFFECTIVE_LOCATION: 4,
  ENUMERATION: 5,
  CHRONOLOGY: 6,
  VOLUME: 7,
  YEAR: 8,
  MATERIAL_TYPE: 9,
};

describe('InstanceViewPage', () => {
  let instance;

  const visitingViewInventoryPageWithContent = () => {
    beforeEach(async function () {
      instance = this.server.create(
        'instance',
        'withHoldingAndItem',
        'withStatisticalCodeIds',
        'withAlternativeTitles',
        'withSeriesStatement',
        'withSubjects',
        'withNotes',
        { title: 'ADVANCING RESEARCH' },
      );
      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });
  };

  const visitingViewInventoryPageWithoutContent = () => {
    beforeEach(async function () {
      instance = this.server.create(
        'instance',
        { title: 'ADVANCING RESEARCH' }
      );
      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });
  };

  const visitingViewInventoryPageWithMarcSource = () => {
    beforeEach(async function () {
      instance = this.server.create(
        'instance',
        'withHoldingAndItem',
        'withStatisticalCodeIds',
        'withAlternativeTitles',
        'withSeriesStatement',
        'withSubjects',
        'withNotes',
        { title: 'ADVANCING RESEARCH' },
      );
      instance.source = 'MARC';
      instance.save();
      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });
  };

  describe('User has permissions', () => {
    setupApplication({ scenarios: ['fetch-items-success'] });

    visitingViewInventoryPageWithContent();

    it('should be displayed', () => {
      expect(InstanceViewPage.hasExpandAll).to.be.true;
    });

    it('accordion should be open', () => {
      expect(InstanceViewPage.accordion.isOpen).to.be.true;
    });

    describe('accordion toggle', () => {
      beforeEach(async () => {
        await InstanceViewPage.accordion.clickHeader();
      });

      it('accordion should not be displayed', () => {
        expect(InstanceViewPage.accordion.isOpen).to.be.false;
      });
    });

    describe('expand all clicked', () => {
      beforeEach(async () => {
        await InstanceViewPage.expandAll.click();
      });

      it('accordion should be displayed', () => {
        expect(InstanceViewPage.accordion.isOpen).to.be.true;
      });

      describe('collapse all', () => {
        beforeEach(async () => {
          await InstanceViewPage.expandAll.click();
        });

        it('accordion should not be displayed', () => {
          expect(InstanceViewPage.accordion.isOpen).to.be.false;
        });
      });
    });

    it('should be collapse all button displayed', () => {
      expect(InstanceViewPage.hasExpandAll).to.be.true;
    });

    it('displays the instance headline under header', () => {
      expect(InstanceViewPage.headlineInViewInstance).to.be.true;
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

      it('should render a move items/holdings button', () => {
        expect(InstanceViewPage.headerDropdownMenu.hasMoveItemsButton).to.be.true;
      });

      it('should render an add item button', () => {
        expect(InstanceViewPage.hasButtonAddItem).to.be.true;
      });

      it('should render an add holdings button', () => {
        expect(InstanceViewPage.hasButtonAddHoldings).to.be.true;
      });

      it('should render a move items within instance button', () => {
        expect(InstanceViewPage.headerDropdownMenu.hasMoveWithinInstanceButton).to.be.true;
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

    describe('move items within instance action', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdown.click();
        await InstanceViewPage.headerDropdownMenu.clickMoveWithinInstance();
      });

      it('should enable dnd for items lists', () => {
        expect(InstanceViewPage.items().length !== 0).to.be.true;
      });

      it('should display additional columns', () => {
        expect(InstanceViewPage.itemsList.columnCount).to.be.equal(12);
      });

      describe('select all action', () => {
        beforeEach(async () => {
          await InstanceViewPage.dragItemsListSelectAll.clickInput();
        });

        it('should mark all items as ready for movement', () => {
          expect(InstanceViewPage.draggableItems().every(item => item.dragSelector.isChecked)).to.be.true;
        });
      });

      describe('unselect all action', () => {
        beforeEach(async () => {
          await InstanceViewPage.dragItemsListSelectAll.clickInput();
          await InstanceViewPage.dragItemsListSelectAll.clickInput();
        });

        it('should mark all items as not ready for movement', () => {
          expect(InstanceViewPage.draggableItems().every(item => !item.dragSelector.isChecked)).to.be.true;
        });
      });

      describe('move selected items', () => {
        beforeEach(async () => {
          await InstanceViewPage.dragItemsListSelectAll.clickInput();
          await InstanceViewPage.MoveToDropdownButton.click();
        });

        it('should open dropdown list', () => {
          expect(InstanceViewPage.moveToDropdown.isPresent).to.be.true;
        });
      });
    });

    describe('statistical codes list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.statisticalCodesList.rowCount).to.be.equal(3);
      });
    });

    describe('alternative titles list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.alternativeTitlesList.rowCount).to.be.equal(1);
      });
    });

    describe('series statement list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.seriesStatementList.rowCount).to.be.equal(1);
      });
    });

    describe('instance notes list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.notes(0).rowCount).to.be.equal(2);
      });

      describe('values of first row', () => {
        it('Staff only: No, Note has text', () => {
          expect(InstanceViewPage.notes(0).rows(0).cells(0).content).to.be.equal('No');
          expect(InstanceViewPage.notes(0).rows(0).cells(1).content).to.be.a('string').that.not.empty;
        });
      });

      describe('values of second row', () => {
        it('Staff only: Yes, Note has text', () => {
          expect(InstanceViewPage.notes(0).rows(1).cells(0).content).to.be.equal('Yes');
          expect(InstanceViewPage.notes(0).rows(1).cells(1).content).to.be.a('string').that.not.empty;
        });
      });
    });

    describe('subject list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.subjectsList.rowCount).to.be.equal(1);
      });
    });

    describe('items per holdings', () => {
      it('has correct amount of columns', () => {
        expect(InstanceViewPage.itemsList.columnCount).to.be.equal(10);
      });

      it('renders correct header captions', () => {
        expect(headersMap.BARCODE.text).to.be.equal(translation['item.barcode']);
        expect(headersMap.STATUS.text).to.be.equal(translation.status);
        expect(headersMap.COPY_NUMBER.text).to.be.equal(translation.copyNumber);
        expect(headersMap.MATERIAL_TYPE.text).to.be.equal(translation.materialType);
        expect(headersMap.LOAN_TYPE.text).to.be.equal(translation.loanType);
        expect(headersMap.EFFECTIVE_LOCATION.text).to.be.equal(translation.effectiveLocationShort);
        expect(headersMap.ENUMERATION.text).to.be.equal(translation.enumeration);
        expect(headersMap.CHRONOLOGY.text).to.be.equal(translation.chronology);
        expect(headersMap.VOLUME.text).to.be.equal(translation.volume);
        expect(headersMap.YEAR.text).to.be.equal(translation.yearCaption);
      });

      describe('sorting', () => {
        describe('compares by `Item: barcode` field', () => {
          beforeEach(async () => {
            await headersMap.BARCODE.click();
          });

          it('ascending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.BARCODE)).to.equal('40875104574');
            expect(InstanceViewPage.getCellContent(1, headersIndex.BARCODE)).to.equal('5860825104574');
            expect(InstanceViewPage.getCellContent(2, headersIndex.BARCODE)).to.equal('60825104574');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.BARCODE.click();
            });

            it('descending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.BARCODE)).to.equal('60825104574');
              expect(InstanceViewPage.getCellContent(1, headersIndex.BARCODE)).to.equal('5860825104574');
              expect(InstanceViewPage.getCellContent(2, headersIndex.BARCODE)).to.equal('40875104574');
            });
          });
        });

        describe('compares by `Status` field', () => {
          beforeEach(async () => {
            await headersMap.STATUS.click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.STATUS)).to.equal('Paged');
            expect(InstanceViewPage.getCellContent(1, headersIndex.STATUS)).to.equal('Checked out');
            expect(InstanceViewPage.getCellContent(2, headersIndex.STATUS)).to.equal('Available');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.STATUS.click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.STATUS)).to.equal('Available');
              expect(InstanceViewPage.getCellContent(1, headersIndex.STATUS)).to.equal('Checked out');
              expect(InstanceViewPage.getCellContent(2, headersIndex.STATUS)).to.equal('Paged');
            });
          });
        });

        describe('compares by `Material type` field', () => {
          beforeEach(async () => {
            await headersMap.MATERIAL_TYPE.click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.MATERIAL_TYPE)).to.equal('text');
            expect(InstanceViewPage.getCellContent(1, headersIndex.MATERIAL_TYPE)).to.equal('book');
            expect(InstanceViewPage.getCellContent(2, headersIndex.MATERIAL_TYPE)).to.equal('book');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.MATERIAL_TYPE.click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.MATERIAL_TYPE)).to.equal('book');
              expect(InstanceViewPage.getCellContent(1, headersIndex.MATERIAL_TYPE)).to.equal('book');
              expect(InstanceViewPage.getCellContent(2, headersIndex.MATERIAL_TYPE)).to.equal('text');
            });
          });
        });

        describe('sorts by `Effective location` field', () => {
          beforeEach(async () => {
            await headersMap.EFFECTIVE_LOCATION.click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.EFFECTIVE_LOCATION)).to.equal('Main Library');
            expect(InstanceViewPage.getCellContent(1, headersIndex.EFFECTIVE_LOCATION)).to.equal('Main Library');
            expect(InstanceViewPage.getCellContent(2, headersIndex.EFFECTIVE_LOCATION)).to.equal('Annex');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.EFFECTIVE_LOCATION.click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.EFFECTIVE_LOCATION)).to.equal('Annex');
              expect(InstanceViewPage.getCellContent(1, headersIndex.EFFECTIVE_LOCATION)).to.equal('Main Library');
              expect(InstanceViewPage.getCellContent(2, headersIndex.EFFECTIVE_LOCATION)).to.equal('Main Library');
            });
          });
        });

        describe('compares by `Enumeration` field', () => {
          beforeEach(async () => {
            await headersMap.ENUMERATION.click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.ENUMERATION)).to.equal('v.73:no.1-6');
            expect(InstanceViewPage.getCellContent(1, headersIndex.ENUMERATION)).to.equal('v.72:no.1-6');
            expect(InstanceViewPage.getCellContent(2, headersIndex.ENUMERATION)).to.equal('v.70:no.7-12');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.ENUMERATION.click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.ENUMERATION)).to.equal('v.70:no.7-12');
              expect(InstanceViewPage.getCellContent(1, headersIndex.ENUMERATION)).to.equal('v.72:no.1-6');
              expect(InstanceViewPage.getCellContent(2, headersIndex.ENUMERATION)).to.equal('v.73:no.1-6');
            });
          });
        });

        describe('compares by `Chronology` field', () => {
          beforeEach(async () => {
            await headersMap.CHRONOLOGY.click();
          });

          it('descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.CHRONOLOGY)).to.equal('1987:Jan.-June');
            expect(InstanceViewPage.getCellContent(1, headersIndex.CHRONOLOGY)).to.equal('1986:Jan.-June');
            expect(InstanceViewPage.getCellContent(2, headersIndex.CHRONOLOGY)).to.equal('1984:July-Dec.');
          });

          describe('and', () => {
            beforeEach(async () => {
              await headersMap.CHRONOLOGY.click();
            });

            it('ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.CHRONOLOGY)).to.equal('1984:July-Dec.');
              expect(InstanceViewPage.getCellContent(1, headersIndex.CHRONOLOGY)).to.equal('1986:Jan.-June');
              expect(InstanceViewPage.getCellContent(2, headersIndex.CHRONOLOGY)).to.equal('1987:Jan.-June');
            });
          });
        });

        describe('clicking on the `Volume` header', () => {
          beforeEach(async () => {
            await headersMap.VOLUME.click();
          });

          it('the item order should be descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.VOLUME)).to.equal('V.2 211');
            expect(InstanceViewPage.getCellContent(1, headersIndex.VOLUME)).to.equal('V.1 2345');
            expect(InstanceViewPage.getCellContent(2, headersIndex.VOLUME)).to.equal('V.1 101');
          });

          describe('clicking on the `Volume` header again', () => {
            beforeEach(async () => {
              await headersMap.VOLUME.click();
            });

            it('the item order should be ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.VOLUME)).to.equal('V.1 101');
              expect(InstanceViewPage.getCellContent(1, headersIndex.VOLUME)).to.equal('V.1 2345');
              expect(InstanceViewPage.getCellContent(2, headersIndex.VOLUME)).to.equal('V.2 211');
            });
          });
        });

        describe('clicking on the `Year, caption` header', () => {
          beforeEach(async () => {
            await headersMap.YEAR.click();
          });

          it('the item order should be descending', () => {
            expect(InstanceViewPage.getCellContent(0, headersIndex.YEAR)).to.equal('2020');
            expect(InstanceViewPage.getCellContent(1, headersIndex.YEAR)).to.equal('2018, 2019, 2020');
            expect(InstanceViewPage.getCellContent(2, headersIndex.YEAR)).to.equal('2015, 2019');
          });

          describe('clicking on the `Year, caption` header again', () => {
            beforeEach(async () => {
              await headersMap.YEAR.click();
            });

            it('the item order should be ascending', () => {
              expect(InstanceViewPage.getCellContent(0, headersIndex.YEAR)).to.equal('2015, 2019');
              expect(InstanceViewPage.getCellContent(1, headersIndex.YEAR)).to.equal('2018, 2019, 2020');
              expect(InstanceViewPage.getCellContent(2, headersIndex.YEAR)).to.equal('2020');
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

        it('should redirect to item form', () => {
          expect(ItemCreatePage.isPresent).to.be.true;
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

    visitingViewInventoryPageWithContent();

    it('should render a edit instance button at the bottom of opened instance', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasEditButton).to.be.false;
    });

    it('should render a duplicate instance button at the bottom of opened instance', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasDuplicateButton).to.be.false;
    });

    it('should render an view source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasViewSourceButton).to.be.false;
    });

    it('should not render an view source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasEditMarcButton).to.be.false;
    });

    it('should not render a duplicate source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasDuplicateMarcButton).to.be.false;
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
      instance = this.server.create('instance', {
        title: 'ADVANCING RESEARCH',
        precedingTitles: [{
          id: 'da672352-7856-4241-ac06-ae62f0bade4c',
          precedingInstanceId: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
          title: 'A semantic web primer',
          hrid: 'inst000000000022',
        }],
        succeedingTitles: [{
          id: '668b93f1-4821-4eb0-8a2b-d507434965f4',
          succeedingInstanceId: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
          title: 'Bridget Jones\'s Baby: the diaries',
          hrid: 'inst000000000022',
        }],
      });

      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });

    it('should show preceding title', () => {
      expect(InstanceViewPage.precedingTitles.rowCount).to.be.equal(1);
    });
    it('should show succeding title', () => {
      expect(InstanceViewPage.succeedingTitles.rowCount).to.be.equal(1);
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

  describe('Nature of content field', () => {
    setupApplication();

    const name = 'audiobook';

    beforeEach(async function () {
      const natureOfContentTerm = this.server.create('nature-of-content-term', { name });
      instance = this.server.create('instance', { natureOfContentTermIds: [natureOfContentTerm.id] });
      this.visit(`/inventory/view/${instance.id}`);
      await InstanceViewPage.whenLoaded();
    });

    it('should display nature of content value', () => {
      expect(InstanceViewPage.natureOfContent.value.text).to.equal(name);
    });
  });

  describe('Empty fields', () => {
    setupApplication({ scenarios: ['fetch-items-success'] });

    visitingViewInventoryPageWithoutContent();

    describe('statistical codes list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.statisticalCodesList.rowCount).to.be.equal(1);
      });

      it('has correct values - dashes', () => {
        expect(InstanceViewPage.statisticalCodesList.rows(0).cells(0).content).to.be.equal('-');
        expect(InstanceViewPage.statisticalCodesList.rows(0).cells(1).content).to.be.equal('-');
      });
    });

    describe('alternative titles list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.alternativeTitlesList.rowCount).to.be.equal(1);
      });

      it('has correct values - dashes', () => {
        expect(InstanceViewPage.alternativeTitlesList.rows(0).cells(0).content).to.be.equal('-');
        expect(InstanceViewPage.alternativeTitlesList.rows(0).cells(1).content).to.be.equal('-');
      });
    });

    describe('series statement list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.seriesStatementList.rowCount).to.be.equal(1);
      });

      it('has correct value - dash', () => {
        expect(InstanceViewPage.seriesStatementList.rows(0).cells(0).content).to.be.equal('-');
      });
    });

    describe('instance notes list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.notes(0).rowCount).to.be.equal(1);
      });

      it('has correct values - dashes', () => {
        expect(InstanceViewPage.notes(0).rows(0).cells(0).content).to.be.equal('-');
        expect(InstanceViewPage.notes(0).rows(0).cells(1).content).to.be.equal('-');
      });
    });

    describe('subject list', () => {
      it('has correct amount of items', () => {
        expect(InstanceViewPage.subjectsList.rowCount).to.be.equal(1);
      });

      it('has correct value - dash', () => {
        expect(InstanceViewPage.subjectsList.rows(0).cells(0).content).to.be.equal('-');
      });
    });

    describe('Nature of content field', () => {
      it('should display dash', () => {
        expect(InstanceViewPage.natureOfContent.value.text).to.equal('-');
      });
    });
  });

  describe('Source is MARC', () => {
    setupApplication({ scenarios: ['fetch-items-success'] });

    visitingViewInventoryPageWithMarcSource();

    it('should render an view source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasEditMarcButton).to.be.true;
    });

    it('should render a duplicate source button', () => {
      expect(InstanceViewPage.headerDropdownMenu.hasDuplicateMarcButton).to.be.true;
    });

    describe('when clicking on Edit MARC button', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdownMenu.clickEditMarcButton();
      });

      it('should redirect to MARC edit page', function () {
        expect(this.location.pathname).to.equal(`/inventory/quick-marc/edit/${instance.id}`);
      });
    });

    // TODO: enable this when https://issues.folio.org/browse/UIQM-66 is done
    describe.skip('when clicking on Duplicate MARC button', () => {
      beforeEach(async () => {
        await InstanceViewPage.headerDropdownMenu.clickDuplicateMarcButton();
      });

      it('should redirect to MARC duplicate page', function () {
        expect(this.location.pathname).to.equal(`/inventory/quick-marc/duplicate/${instance.id}`);
      });
    });
  });
});
