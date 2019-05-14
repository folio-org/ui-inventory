import {
  interactor,
  scoped,
  collection,
  selectable,
  fillable,
  clickable,
  text
} from '@bigtest/interactor';

@interactor class SearchFilter {
  static defaultScope = '#input-inventory-search-qindex';

  all = text('option[value=all]');
}

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  instances = collection('[role=row] a');

  instance = scoped('[data-test-instance-details]');

  chooseFilter = selectable('#input-inventory-search-qindex');
  filter = new SearchFilter();

  fillFilter = fillable('#input-inventory-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');
}
