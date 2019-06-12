import {
  interactor,
  clickable,
  text,
  isPresent,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor'; // eslint-disable-line
import ModalInteractor from '@folio/stripes-components/lib/Modal/tests/interactor'; // eslint-disable-line
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor'; // eslint-disable-line

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

@interactor class ItemViewPage {
  isLoaded = isPresent('[data-test-item-view-page]');
  title = text('[data-test-header-item-title]');

  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  hasMarkAsMissingModal = isPresent('[data-test-missingConfirmation-modal]');
  cannotDeleteItemModal = new ModalInteractor('[data-test-cannot-delete-item-modal]');
  cannotDeleteItemModalBackButton = new ButtonInteractor('[data-test-cannot-delete-item-back-action]');
  confirmDeleteItemModal = new ConfirmationModalInteractor('#confirmDeleteItemModal');
  whenLoaded() {
    return this.timeout(3000).when(() => this.isLoaded);
  }
}

export default new ItemViewPage();
