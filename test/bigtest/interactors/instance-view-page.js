import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
  scoped,
  property,
} from '@bigtest/interactor';

// eslint-disable-next-line import/no-extraneous-dependencies
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
// eslint-disable-next-line import/no-extraneous-dependencies
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import KeyValue from './KeyValue';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('#edit-instance');
  hasEditButton = isPresent('#edit-instance');
  clickDuplicate = clickable('#copy-instance');
  hasDuplicateButton = isPresent('#copy-instance');
  hasViewSourceButton = isPresent('#clickable-view-source');
  hasEditMarcButton = isPresent('#edit-instance-marc');
  disabledNewViewSourceButton = property('#clickable-view-source', 'disabled');
}

@interactor class Item {
  hasAppIcon = isPresent('[data-test-items-app-icon]');
  hasBarcodeLink = isPresent('[data-test-item-link]');
  hasCopyIcon = isPresent('[data-test-items-copy-icon]');
  clickBarcode = clickable('[data-test-item-link]');
}

@interactor class InstanceViewPage {
  isLoaded = isPresent('[data-test-header-title]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  hasHeaderDropdown = isPresent('[class^=DropdownMenuTether---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  itemsList = new MultiColumnListInteractor('#list-items');
  seriesStatementList = new MultiColumnListInteractor('#list-series-statement');
  subjectsList = new MultiColumnListInteractor('#list-subject');
  statisticalCodesList = new MultiColumnListInteractor('#list-statistical-codes');
  alternativeTitlesList = new MultiColumnListInteractor('#list-alternative-titles');
  items = collection('#list-items div[class^=mclRow]', Item);
  hasViewHoldingsButton = isPresent('[data-test-view-holdings]');
  clickViewHoldings = clickable('[data-test-view-holdings]');
  hasButtonAddItem = isPresent('#clickable-new-item');
  clickButtonAddItem = clickable('#clickable-new-item');
  hasButtonAddHoldings = isPresent('#clickable-new-holdings-record');
  clickButtonAddHoldings = clickable('#clickable-new-holdings-record');
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
  accordion = new AccordionInteractor('#acc02');
  expandAll = scoped('[data-test-expand-all] button');
  hasExpandAll = isPresent('[data-test-expand-all] button');
  precedingTitles = new MultiColumnListInteractor('#precedingTitles');
  succeedingTitles = new MultiColumnListInteractor('#succeedingTitles');
  natureOfContent = scoped('[data-test-nature-of-content-terms] div', KeyValue);

  notes = collection('[id^="list-instance-notes"]', MultiColumnListInteractor);

  getCellContent(row, cell) {
    return this.itemsList.rows(row).cells(cell).content;
  }
}

export default new InstanceViewPage({
  scope: '[data-test-instance-details]',
  timeout: 20000,
});
