import {
  interactor,
  clickable,
  text,
  isPresent,
  collection,
} from '@bigtest/interactor';

import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor'; // eslint-disable-line
import ModalInteractor from '@folio/stripes-components/lib/Modal/tests/interactor'; // eslint-disable-line
import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor'; // eslint-disable-line
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

@interactor class HeaderDropdown {
  click = clickable('button');
}

@interactor class HeaderDropdownMenu {
  clickEdit = clickable('[data-test-inventory-edit-item-action]');
  hasDuplicate = isPresent('[data-test-inventory-duplicate-item-action]');
  clickDuplicate = clickable('[data-test-inventory-duplicate-item-action]');
  hasNewRequestItem = isPresent('[data-test-inventory-create-request-action]');
  hasMarkAsMissing = isPresent('[data-test-mark-as-missing-item]');
  clickMarkAsMissing = clickable('[data-test-mark-as-missing-item]');
  hasDeleteItem = isPresent('[data-test-inventory-delete-item-action]');
  clickDelete = clickable('[data-test-inventory-delete-item-action]');
}

@interactor class CirculationHistory {
  keyValues = collection('[data-test-kv-value]');
}

@interactor class ItemViewPage {
  isLoaded = isPresent('[data-test-item-view-page]');
  title = text('[data-test-header-item-title]');

  headerDropdown = new HeaderDropdown('[class*=paneHeaderCenterInner---] [class*=dropdown---]');
  headerDropdownMenu = new HeaderDropdownMenu();
  hasMarkAsMissingModal = isPresent('#confirmDeleteItemModal');
  hasDeleteModal = isPresent('[data-test-missingConfirmation-modal]');
  hasEditItemButton = isPresent('[data-test-clickable-edit-item]');
  clickEditItemButton = clickable('[data-test-clickable-edit-item]');
  cannotDeleteItemModal = new ModalInteractor('[data-test-cannot-delete-item-modal]');
  cannotDeleteItemModalBackButton = new ButtonInteractor('[data-test-cannot-delete-item-back-action]');
  confirmDeleteItemModal = new ConfirmationModalInteractor('#confirmDeleteItemModal');
  enumerationDataAccordion = new AccordionInteractor('[data-test-item-view-page] #acc03');
  statisticalCodeTable = new MultiColumnListInteractor('#item-list-statistical-codes');
  electronicAccessTable = new MultiColumnListInteractor('#item-list-electronic-access');
  collapseAllButton = new ButtonInteractor('#collapse-all');
  circulationHistoryAccordion = new CirculationHistory('[data-test-item-view-page] #acc09');

  whenLoaded() {
    return this.timeout(6000).when(() => this.isLoaded);
  }
}

export default new ItemViewPage();
