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
import CheckboxInteractor from '@folio/stripes-components/lib/Checkbox/tests/interactor';

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
  hasMoveWithinInstanceButton = isPresent('#move-instance-items');
  clickMoveWithinInstance = clickable('#move-instance-items');
  disabledNewViewSourceButton = property('#clickable-view-source', 'disabled');
  hasMoveItemsButton = isPresent('#move-instance');
}

@interactor class Item {
  hasAppIcon = isPresent('[data-test-items-app-icon]');
  hasBarcodeLink = isPresent('[data-test-item-link]');
  hasCopyIcon = isPresent('[data-test-items-copy-icon]');
  clickBarcode = clickable('[data-test-item-link]');
  dragSelector = scoped('[data-test-select-item]', CheckboxInteractor);
}

@interactor class DropdownList {
  static defaultScope = '[data-test-move-to-dropdown]';

  list = collection('div[role="button"]');
}

@interactor class InstanceViewPage {
  isLoaded = isPresent('[data-test-instance-header-title]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[data-test-instance-header-title]');
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  hasHeaderDropdown = isPresent('[class^=DropdownMenuTether---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  itemsList = new MultiColumnListInteractor('[id^="list-items"]');
  dragItemsListSelectAll = scoped('[id^="list-items"] [data-test-select-all-items]', CheckboxInteractor);
  seriesStatementList = new MultiColumnListInteractor('#list-series-statement');
  subjectsList = new MultiColumnListInteractor('#list-subject');
  statisticalCodesList = new MultiColumnListInteractor('#list-statistical-codes');
  alternativeTitlesList = new MultiColumnListInteractor('#list-alternative-titles');
  items = collection('[id^="list-items"] div[class^=mclRow]', Item);
  draggableItems = collection('[id^="list-items"] div[draggable]', Item);
  hasViewHoldingsButton = isPresent('[data-test-view-holdings]');
  clickViewHoldings = clickable('[data-test-view-holdings]');
  hasButtonAddItem = isPresent('[data-test-add-item]');
  clickButtonAddItem = clickable('[data-test-add-item]');
  hasButtonAddHoldings = isPresent('#clickable-new-holdings-record');
  clickButtonAddHoldings = clickable('#clickable-new-holdings-record');
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
  accordion = new AccordionInteractor('#acc02');
  expandAll = scoped('[data-test-expand-all] button');
  hasExpandAll = isPresent('[data-test-expand-all] button');
  precedingTitles = new MultiColumnListInteractor('#precedingTitles');
  succeedingTitles = new MultiColumnListInteractor('#succeedingTitles');
  natureOfContent = scoped('[data-test-nature-of-content-terms] div', KeyValue);
  MoveToDropdownButton = scoped('[data-test-move-holdings]');
  moveToDropdown = new DropdownList();

  notes = collection('[id^="list-instance-notes"]', MultiColumnListInteractor);

  getCellContent(row, cell) {
    return this.itemsList.rows(row).cells(cell).content;
  }
}

export default new InstanceViewPage({
  scope: '[data-test-instance-details]',
  timeout: 20000,
});
