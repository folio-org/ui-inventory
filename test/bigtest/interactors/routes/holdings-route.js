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

  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-holdings-discovery-suppress]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-discoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#holdingDiscoverySuppress button[class^="iconButton---"]');
}

