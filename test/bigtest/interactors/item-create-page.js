import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('[data-test-inventory-cancel-item-edit-action]');
}

@interactor class ItemCreatePage {
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
}

export default new ItemCreatePage('[data-test-item-page-type="create"]');
