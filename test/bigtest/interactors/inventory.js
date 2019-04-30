import {
  interactor,
  scoped,
  collection,
  selectable,
  fillable,
  clickable,
} from '@bigtest/interactor';

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  instances = collection('[role=row] a');

  instance = scoped('[data-test-instance-details]');

  chooseFilter = selectable('#input-inventory-search-qindex');
  fillFilter = fillable('#input-inventory-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');
}
