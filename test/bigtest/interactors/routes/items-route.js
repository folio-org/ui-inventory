import {
  clickable,
  interactor,
  isPresent,
  collection,
  scoped,
} from '@bigtest/interactor';

import {
  MultiSelectFilterInteractor,
  CheckboxFilterInteractor,
  SearchFieldFilterInteractor,
} from '../filters';

export default @interactor class ItemsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  materialTypeFilter = scoped('#materialTypeAccordion', MultiSelectFilterInteractor);
  permLocationFilter = scoped('#holdingsPermanentLocationAccordion', MultiSelectFilterInteractor);
  itemStatusFilter = scoped('#itemFilterAccordion', CheckboxFilterInteractor);

  rows = collection('#list-inventory [data-row-index]');

  isDiscoverySuppressFilterPresent = isPresent('[data-test-filter-item-discovery-suppress]');
  clickSelectDiscoverySuppressFilter = clickable('#clickable-filter-discoverySuppress-true');
  clickClearDiscoverySuppressFilter = clickable('#itemDiscoverySuppressAccordion button[class^="iconButton---"]');
  searchFieldFilter = scoped('#pane-filter', SearchFieldFilterInteractor);
}
