import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
  scoped,
} from '@bigtest/interactor';

// eslint-disable-next-line /no-extraneous-dependencies
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('#edit-instance');
  hasEditButton = isPresent('#edit-instance');
  clickDuplicate = clickable('#copy-instance');
  hasDuplicateButton = isPresent('#copy-instance');
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
  headerDropdownMenu = new HeaderDropdownMenu();
  items = collection('#list-items div[class^=mclRow]', Item);
  hasViewHoldingsButton = isPresent('[data-test-view-holdings]');
  clickViewHoldings = clickable('[data-test-view-holdings]');
  clickEditInstance = clickable('[data-test-clickable-edit]');
  hasButtonEditInstance = isPresent('[data-test-clickable-edit]');
  hasButtonAddItem = isPresent('#clickable-new-item');
  clickButtonAddItem = clickable('#clickable-new-item');
  hasButtonAddHoldings = isPresent('#clickable-new-holdings-record');
  clickButtonAddHoldings = clickable('#clickable-new-holdings-record');
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
  accordion = new AccordionInteractor('[data-test-accordion]');
  expandAll = scoped('[data-test-expand-all]');
}

export default new InstanceViewPage('[data-test-instance-details]');
