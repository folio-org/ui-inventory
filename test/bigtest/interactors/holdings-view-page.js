import {
  interactor,
  clickable,
  isPresent,
  isVisible,
  text
} from '@bigtest/interactor';

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
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsViewPage({ timeout: 6000 });
