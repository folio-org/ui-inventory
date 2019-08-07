import {
  interactor,
  scoped,
  collection,
  selectable,
  fillable,
  clickable,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class InventoryInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessageLabel]');
  instances = collection('#list-inventory [role=row] a');

  instance = scoped('[data-test-instance-details]');
  chooseSearchOption= selectable('#input-inventory-search-qindex');

  fillSearchField = fillable('#input-inventory-search');
  clickSearch = clickable('[data-test-search-and-sort-submit]');

  clickOnTextResourceTypeFilter = clickable('#clickable-filter-resource-text');
  clikckOnAnnexLocationFilter = clickable('#clickable-filter-location-annex');

  openInstance = clickable('[role=row] a');
  openItem = clickable('[data-test-items] a');
  closeItem = clickable('[data-test-item-view-page] button:first-child')
}
