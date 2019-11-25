import {
  clickable,
  interactor,
  isPresent,
  collection,
  scoped,
} from '@bigtest/interactor';

import {
  MultiSelectFilterInteractor,
  SearchFieldFilterInteractor,
} from '../filters';

export default @interactor class HoldingsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  rows = collection('#list-inventory [data-row-index]');

  effectiveLocationFilter = scoped('#holdingsEffectiveLocationAccordion', MultiSelectFilterInteractor);
  permLocationFilter = scoped('#holdingsPermanentLocationAccordion', MultiSelectFilterInteractor);
  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-holdings-discovery-suppress]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-discoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#holdingDiscoverySuppress button[class^="iconButton---"]');
  searchFieldFilter = scoped('#pane-filter', SearchFieldFilterInteractor);
}
