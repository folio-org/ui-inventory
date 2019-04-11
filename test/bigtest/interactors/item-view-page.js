import {
  interactor,
  clickable,
  text,
  isPresent,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('[data-test-inventory-edit-item-action]');
  clickDuplicate = clickable('[data-test-inventory-duplicate-item-action]');
  hasNewRequestItem = isPresent('[data-test-inventory-create-request-action]');
  hasMarkAsMissing = isPresent('[data-test-mark-as-missing-item]');
  clickMarkAsMissing = clickable('[data-test-mark-as-missing-item]');
  hasDeleteItem = isPresent('[data-test-inventory-delete-item-action]');
  clickDelete = clickable('[data-test-inventory-delete-item-action]');
}

@interactor class NoDeleteItemModal {
  hasBackButton = isPresent('[data-test-no-delete-item-back-action]');
}

@interactor class ItemViewPage {
  title = text('[data-test-header-title]');

  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  noDeleteItemModal = new NoDeleteItemModal();
  hasMarkAsMissingModal = isPresent('[data-test-missingConfirmation-modal]');
  hasConfirmDeleteModal = isPresent('[data-test-deleteconfirmation-modal]');
  hasNoDeleteItemModal = isPresent('[data-test-nodeleteitem-modal]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new ItemViewPage('[data-test-item-view-page]');
