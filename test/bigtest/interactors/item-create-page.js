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
  clickCancel = clickable('[data-test-inventory-cancel-item-edit-action]');
}

@interactor class ItemCreatePage {
  isLoaded = isPresent('[data-test-header-title]');

  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();

  whenLoaded() {
    return this.timeout(6000).when(() => this.isLoaded);
  }
}

export default new ItemCreatePage('[data-test-item-page-type="create"]');
