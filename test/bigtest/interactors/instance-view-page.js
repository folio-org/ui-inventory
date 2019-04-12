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
  clickEdit = clickable('#edit-instance');
  clickDuplicate = clickable('#copy-instance');
}

@interactor class Items {
  isLoaded = isPresent('[data-test-items]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  itemsHasAppIcon = isPresent('[data-test-items-app-icon]');
}

@interactor class InstanceViewPage {
  isLoaded = isPresent('[data-test-header-title]');
  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[data-test-header-title]');
  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  items = new Items('[data-test-items]');

  itemsHasAppIcon = isPresent('[data-test-items-app-icon]');
}

export default new InstanceViewPage('[data-test-instance-details]');
