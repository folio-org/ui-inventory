import {
  interactor,
  isPresent,
  text,
  clickable,
  scoped,
  collection,
} from '@bigtest/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

@interactor class InventoryMovementActions {
  clickViewMarc = clickable('[data-test-movement-details-view-source]');
  clickEdit = clickable('[data-test-movement-details-edit-instance]');
}

@interactor class DropdownList {
  static defaultScope = '[data-test-move-to-dropdown]';

  list = collection('div[role="button"]');
}


@interactor class InstanceMovementDetails {
  isLoaded = isPresent('[data-test-pane-header-title]');

  whenLoaded() {
    return this.timeout(10000).when(() => this.isLoaded);
  }

  title = text('[data-test-pane-header-title]');
  close = clickable('[data-test-pane-header-dismiss-button]');

  headerDropdown = scoped('[data-test-pane-header-actions-button]');
  headerDropdownMenu = new InventoryMovementActions();
  MoveToDropdownButton = scoped('[data-test-move-holdings]');
  moveToDropdown = new DropdownList();
  confirmModal = new ConfirmationModalInteractor('#move-holding-confirmation');
}

export default InstanceMovementDetails;
