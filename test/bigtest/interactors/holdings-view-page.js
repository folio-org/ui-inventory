import {
  interactor,
  clickable,
  isPresent,
  text,
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
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  hasConfirmDeleteModal = isPresent('[data-test-delete-confirmation-modal]');
  hasNoDeleteHoldingsRecordModal = isPresent('[data-test-no-delete-holdingsrecord-modal]');
}

export default new HoldingsViewPage('[data-test-holdings-view-page]');
