import {
  interactor,
  isPresent,
  clickable,
  text,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('[data-test-inventory-cancel-item-edit-action]');
}

@interactor class ItemEditPage {
  isLoaded = isPresent('[data-test-header-title]');

  title = text('[data-test-header-title]');
  sub = text('[data-test-header-sub]');
  headerDropdown = new HeaderDropdown('[data-test-item-page-type="edit"] [data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();
  whenLoaded() {
    return this.timeout(6000).when(() => this.isLoaded);
  }
}

export default new ItemEditPage('[data-test-item-page-type="edit"]');
