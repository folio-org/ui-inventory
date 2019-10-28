import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
  scoped,
  attribute,
} from '@bigtest/interactor';

// eslint-disable-next-line import/no-extraneous-dependencies
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('#edit-instance');
  hasEditButton = isPresent('#edit-instance');
  clickDuplicate = clickable('#copy-instance');
  hasDuplicateButton = isPresent('#copy-instance');
  hasViewSourceButton = isPresent('#clickable-view-source');
  isDisabledViewSourceButton = attribute('#clickable-view-source', 'disabled');
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
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  hasHeaderDropdown = isPresent('[class^=DropdownMenuTether---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  items = collection('#list-items div[class^=mclRow]', Item);
  hasViewHoldingsButton = isPresent('[data-test-view-holdings]');
  clickViewHoldings = clickable('[data-test-view-holdings]');
  clickEditInstance = clickable('#clickable-edit-instance');
  hasButtonEditInstance = isPresent('#clickable-edit-instance');
  hasButtonAddItem = isPresent('#clickable-new-item');
  clickButtonAddItem = clickable('#clickable-new-item');
  hasButtonAddHoldings = isPresent('#clickable-new-holdings-record');
  clickButtonAddHoldings = clickable('#clickable-new-holdings-record');
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
  accordion = new AccordionInteractor('#acc02');
  expandAll = scoped('[data-test-expand-all] button');
  hasExpandAll = isPresent('[data-test-expand-all] button');
}

export default new InstanceViewPage('[data-test-instance-details]');
