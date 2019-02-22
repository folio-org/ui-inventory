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
}

@interactor class ItemViewPage {
  title = text('[data-test-header-title]');

  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  hasMarkAsMissingModal = isPresent('[data-test-missingConfirmation-modal]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new ItemViewPage('[data-test-item-view-page]');
