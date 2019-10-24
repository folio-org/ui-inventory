import {
  interactor,
  isPresent,
  clickable,
  collection,
  text, is,
} from '@bigtest/interactor';

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
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
}

export default new InstanceViewPage('[data-test-instance-details]');
