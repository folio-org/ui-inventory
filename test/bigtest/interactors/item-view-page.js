import {
  interactor,
  clickable,
  text,
  isPresent,
  collection,
  scoped,
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
  hasEdit = isPresent('[data-test-inventory-edit-item-action]');
  clickEdit = clickable('[data-test-inventory-edit-item-action]');
  hasDuplicate = isPresent('[data-test-inventory-duplicate-item-action]');
  clickDuplicate = clickable('[data-test-inventory-duplicate-item-action]');
  hasNewRequestItem = isPresent('[data-test-inventory-create-request-action]');
  hasMarkAsMissing = isPresent('[data-test-mark-as-missing-item]');
  clickMarkAsMissing = clickable('[data-test-mark-as-missing-item]');
  hasMarkAsWithdrawn = isPresent('[data-test-mark-as-withdrawn-item]');
  clickMarkAsWithdrawn = clickable('[data-test-mark-as-withdrawn-item]')
  hasDeleteItem = isPresent('[data-test-inventory-delete-item-action]');
  clickDelete = clickable('[data-test-inventory-delete-item-action]');
}

@interactor class AccordionSection {
  keyValues = collection('[data-test-kv-value]');
}

@interactor class ItemViewPage {
  isLoaded = isPresent('[data-test-item-view-page]');
  title = text('[data-test-header-item-title]');

  headerDropdown = new HeaderDropdown('[data-pane-header-actions-dropdown]');
  headerDropdownMenu = new HeaderDropdownMenu();
  hasDeleteModal = isPresent('#confirmDeleteItemModal');
  hasMarkAsMissingModal = isPresent('[data-test-missingConfirmation-modal]');
  markAsMissingModal = scoped('[data-test-missingConfirmation-modal]');
  hasMarkAsWithdrawnModal = isPresent('[data-test-withdrawn-confirmation-modal]');
  markAsWithdrawnModal = scoped('[data-test-withdrawn-confirmation-modal]');
  cannotDeleteItemModal = new ModalInteractor('[data-test-cannot-delete-item-modal]');
  cannotDeleteItemModalBackButton = new ButtonInteractor('[data-test-cannot-delete-item-back-action]');
  confirmDeleteItemModal = new ConfirmationModalInteractor('#confirmDeleteItemModal');
  enumerationDataAccordion = new AccordionInteractor('[data-test-item-view-page] #acc03');
  statisticalCodeTable = new MultiColumnListInteractor('#item-list-statistical-codes');
  electronicAccessTable = new MultiColumnListInteractor('#item-list-electronic-access');
  collapseAllButton = new ButtonInteractor('#collapse-all');
  loanAccordion = new AccordionSection('[data-test-item-view-page] #acc06');
  circulationHistoryAccordion = new AccordionSection('[data-test-item-view-page] #acc09');
  confirmButton = new ButtonInteractor('[data-test-confirmation-modal-confirm-button]');

  whenLoaded() {
    return this.timeout(6000).when(() => this.isLoaded);
  }
}

export default new ItemViewPage({
  timeout: 10000,
});
