import {
  interactor,
  isPresent,
  text,
  clickable,
  scoped,
} from '@bigtest/interactor';

@interactor class InventoryMovementActions {
  clickViewMarc = clickable('[data-test-movement-details-view-source]');
  clickEdit = clickable('[data-test-movement-details-edit-instance]');
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
}

export default InstanceMovementDetails;
