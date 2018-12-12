import {
  interactor,
  clickable,
  text,
} from '@bigtest/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickCancel = clickable('#cancel-instance-edition');
}

@interactor class InstanceEditPage {
  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
}

export default new InstanceEditPage('[data-test-instance-page-type="edit"]');
