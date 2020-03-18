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
  clickCancel = clickable('#cancel-holdings-creation');
}

@interactor class HoldingsEditPage {
  isLoaded = isPresent('[data-test-holdings-page-type="edit"]');

  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }
}

export default new HoldingsEditPage({ timeout: 6000 });
