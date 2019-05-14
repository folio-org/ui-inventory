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
  barcode = text('option[value="item.barcode"]');
  instanceId = text('option[value=id]');
  title = text('option[value=title]');
  identifier = text('option[value=identifier]');
  isbn = text('option[value=isbn]');
  issn = text('option[value=issn]');
  contributor = text('option[value=contributor]');
  subject = text('option[value=subject]');
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
