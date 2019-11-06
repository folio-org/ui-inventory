import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import MultiSelectFilterInteractor from '../filters/multiselect-filter';

export default @interactor class ItemsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  materialTypeFilter = scoped('#materialTypeAccordion', MultiSelectFilterInteractor);
  rows = collection('#list-inventory [data-row-index]');
}
