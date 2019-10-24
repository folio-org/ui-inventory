import {
  interactor,
  isPresent,
  clickable,
  collection,
  text,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('#edit-instance');
  clickDuplicate = clickable('#copy-instance');
}

@interactor class Item {
  hasAppIcon = isPresent('[data-test-items-app-icon]');
  hasBarcodeLink = isPresent('[data-test-item-link]');
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
  headlineInViewInstance = isPresent('[data-test-headline-medium]');
}

export default new InstanceViewPage('[data-test-instance-details]');
