import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import {
  MultiSelectFilterInteractor,
  CheckboxFilterInteractor,
} from '../filters';

export default @interactor class ItemsRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  materialTypeFilter = scoped('#materialTypeAccordion', MultiSelectFilterInteractor);
  itemStatusFilter = scoped('#itemFilterAccordion', CheckboxFilterInteractor);

  rows = collection('#list-inventory [data-row-index]');
}
