import {
  interactor,
  collection,
  scoped,
} from '@bigtest/interactor';

import { SearchFieldFilterInteractor } from '../filters';

export default @interactor class InstancesRouteInteractor {
  static defaultScope = '[data-test-inventory-instances]';

  searchFieldFilter = scoped('#pane-filter', SearchFieldFilterInteractor);
  rows = collection('#list-inventory [data-row-index]');
  headers = collection('#list-inventory [data-test-clickable-header]');
}
