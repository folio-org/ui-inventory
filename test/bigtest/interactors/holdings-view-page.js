import {
  interactor,
  clickable,
  isPresent,
  isVisible,
  text,
  scoped,
} from '@bigtest/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('#edit-holdings');
  clickDuplicate = clickable('#copy-holdings');
  hasDeleteHoldingsRecord = isPresent('[data-test-inventory-delete-holdingsrecord-action]');
  clickDelete = clickable('[data-test-inventory-delete-holdingsrecord-action]');
}

@interactor class HoldingsViewPage {
  isLoaded = isPresent('[data-test-header-title]');

  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  confirmDeleteModalIsVisible = isVisible('#delete-confirmation-modal');
  confirmDeleteModalIsPresent = isPresent('#delete-confirmation-modal');
  noDeleteHoldingsRecordModalIsVisible = isVisible('[data-test-no-delete-holdingsrecord-modal]');
  noDeleteHoldingsRecordModalIsPresent = isPresent('[data-test-no-delete-holdingsrecord-modal]');
  administrativeDataAccordion = new AccordionInteractor('#acc01');
  statisticalCodesList = new MultiColumnListInteractor('#list-statistical-codes');
  holdingsStatementsList = new MultiColumnListInteractor('#list-holdingsstatements');
  holdingsStatementsForSupplementsList = new MultiColumnListInteractor('#list-holdingsstatementsforsupplements');
  holdingsStatementsForIndexesList = new MultiColumnListInteractor('#list-holdingsstatementsforindexes');
  holdingsNotesList = new MultiColumnListInteractor('#list-holdingsnotes');
  electronicAccessList = new MultiColumnListInteractor('#list-electronic-access');
  expandAll = scoped('[data-test-expand-all] button');
  hasExpandAll = isPresent('[data-test-expand-all] button');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsViewPage({ timeout: 6000 });
