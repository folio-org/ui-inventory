import {
  clickable,
  interactor,
  isPresent,
  collection,
  scoped,
} from '@bigtest/interactor';

export default @interactor class HoldingsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  rows = collection('#list-inventory [data-row-index]');

  isStaffSuppressFilterPresent = isPresent('[data-test-filter-holdings-staff-suppress]');
  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-holdings-discovery-suppress]');
  clickSelectStaffSuppressFilter = clickable('#clickable-filter-staffSuppress-true');
  clickClearStaffSuppressFilter = clickable('#staffSuppress button[class^="iconButton---"]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-discoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#discoverySuppress button[class^="iconButton---"]');
}

