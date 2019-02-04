import {
  interactor,
  scoped,
  collection
} from '@bigtest/interactor';

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  instances = collection('[role=row] a');

  instance = scoped('[data-test-instance-details]');
}
